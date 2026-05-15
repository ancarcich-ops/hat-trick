/**
 * combine-supabase.js — backend layer for Combine groups + leaderboards.
 *
 * Public API hangs off window.Combine. The rest of app.js calls into these
 * functions; this file owns all Supabase interaction.
 */
window.Combine = window.Combine || {};
(function () {
  const SUPABASE_URL = "https://dafrpyeghfjoarlmfera.supabase.co";
  const SUPABASE_ANON =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhZnJweWVnaGZqb2FybG1mZXJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4MTI1NDQsImV4cCI6MjA5NDM4ODU0NH0.NGuclcLVLn-E0GruhnxCwp-W4MNwC8Tu_bbQZQSRMXI";

  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

  let cachedPlayer = null; // { id, display_name }

  /**
   * Get or create an anonymous session. Returns the user's UID.
   * Called once on app boot.
   */
  async function ensureSession() {
    const { data: sessionData } = await sb.auth.getSession();
    if (sessionData?.session?.user?.id) return sessionData.session.user.id;
    const { data, error } = await sb.auth.signInAnonymously();
    if (error) throw error;
    return data.user.id;
  }

  /**
   * Look up the player row for the current user. Returns null if no row
   * (display name not set yet).
   */
  async function getPlayer() {
    if (cachedPlayer) return cachedPlayer;
    const uid = await ensureSession();
    const { data, error } = await sb
      .from("players")
      .select("id, display_name")
      .eq("id", uid)
      .maybeSingle();
    if (error) throw error;
    cachedPlayer = data;
    return data;
  }

  /**
   * Create or update the player's display name. Returns the player row.
   */
  async function setDisplayName(displayName) {
    const uid = await ensureSession();
    const name = String(displayName || "")
      .trim()
      .slice(0, 24);
    if (!name) throw new Error("Display name required");
    const { data, error } = await sb
      .from("players")
      .upsert({ id: uid, display_name: name }, { onConflict: "id" })
      .select("id, display_name")
      .single();
    if (error) throw error;
    cachedPlayer = data;
    return data;
  }

  // 6-char group code — uppercase letters + digits, no confusing chars (I/O/L/0/1).
  function generateCode() {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  }

  async function createGroup({ name, level, contentType }) {
    const player = await getPlayer();
    if (!player) throw new Error("Set a display name first");
    // Try up to 5 codes in case of (extremely rare) collisions.
    let lastError;
    for (let attempt = 0; attempt < 5; attempt++) {
      const code = generateCode();
      const { data, error } = await sb
        .from("groups")
        .insert({
          id: code,
          name: name.trim().slice(0, 40),
          level,
          content_type: contentType,
          created_by: player.id,
        })
        .select()
        .single();
      if (!error) {
        // Auto-join the creator.
        await sb
          .from("group_members")
          .insert({ group_id: code, player_id: player.id });
        return data;
      }
      lastError = error;
      // 23505 = unique constraint violation (code collision) — retry
      if (error.code !== "23505") break;
    }
    throw lastError || new Error("Could not create group");
  }

  async function joinGroup(code) {
    const player = await getPlayer();
    if (!player) throw new Error("Set a display name first");
    const cleanCode = String(code || "")
      .trim()
      .toUpperCase();
    if (!cleanCode) throw new Error("Code required");
    // Verify the group exists first so we can show a useful error.
    const { data: group, error: gErr } = await sb
      .from("groups")
      .select("id, name, level, content_type")
      .eq("id", cleanCode)
      .maybeSingle();
    if (gErr) throw gErr;
    if (!group) throw new Error("Group not found");
    const { error } = await sb
      .from("group_members")
      .upsert(
        { group_id: cleanCode, player_id: player.id },
        { onConflict: "group_id,player_id" },
      );
    if (error) throw error;
    return group;
  }

  async function leaveGroup(code) {
    const player = await getPlayer();
    if (!player) return;
    const { error } = await sb
      .from("group_members")
      .delete()
      .eq("group_id", code)
      .eq("player_id", player.id);
    if (error) throw error;
  }

  async function listMyGroups() {
    const player = await getPlayer();
    if (!player) return [];
    const { data, error } = await sb
      .from("group_members")
      .select("joined_at, groups(id, name, level, content_type, created_at)")
      .eq("player_id", player.id);
    if (error) throw error;
    return (data || [])
      .map((row) => ({ ...row.groups, joined_at: row.joined_at }))
      .filter((g) => g.id);
  }

  /**
   * Submit a daily score. Uses "keep the better score" upsert logic — if a
   * row already exists for (player, date, mode), we update only if the new
   * score is higher. Implemented as a simple read-then-write since the
   * scores table doesn't have a server-side trigger.
   */
  async function submitScore({
    date,
    level,
    contentType,
    score,
    correctCount,
  }) {
    const player = await getPlayer();
    if (!player) return; // no display name yet — silently skip
    // Check existing
    const { data: existing } = await sb
      .from("scores")
      .select("score")
      .eq("player_id", player.id)
      .eq("date", date)
      .eq("level", level)
      .eq("content_type", contentType)
      .maybeSingle();
    if (existing && existing.score >= score) return existing; // keep the better one
    const row = {
      player_id: player.id,
      date,
      level,
      content_type: contentType,
      score,
      correct_count: correctCount,
    };
    const { data, error } = await sb
      .from("scores")
      .upsert(row, { onConflict: "player_id,date,level,content_type" })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  /**
   * Get a leaderboard for a group across a time range.
   * range: 'today' | 'week' | 'all'
   * Returns an array sorted desc by primary metric:
   *   - today: by score, top first
   *   - week / all: by average, top first
   * Each row: { player_id, display_name, score (today), avg, plays, last_date }
   */
  async function getGroupLeaderboard(groupId, range) {
    // 1. group + members
    const { data: group, error: gErr } = await sb
      .from("groups")
      .select("id, name, level, content_type")
      .eq("id", groupId)
      .single();
    if (gErr) throw gErr;
    const { data: members, error: mErr } = await sb
      .from("group_members")
      .select("player_id, players(id, display_name)")
      .eq("group_id", groupId);
    if (mErr) throw mErr;
    const memberList = (members || []).map((m) => m.players).filter(Boolean);
    if (memberList.length === 0) return { group, rows: [] };

    const playerIds = memberList.map((p) => p.id);
    const today = todayKey();

    // Date filter for the query
    let fromDate = null;
    if (range === "today") {
      fromDate = today;
    } else if (range === "week") {
      const d = new Date();
      d.setDate(d.getDate() - 6); // rolling 7-day window
      fromDate = isoDate(d);
    }
    // all-time: no filter

    let query = sb
      .from("scores")
      .select("player_id, date, score, correct_count")
      .in("player_id", playerIds)
      .eq("level", group.level)
      .eq("content_type", group.content_type);
    if (fromDate) {
      query = query.gte("date", fromDate);
    }
    if (range === "today") {
      query = query.lte("date", today);
    }
    const { data: scores, error: sErr } = await query;
    if (sErr) throw sErr;

    // Aggregate
    const byPlayer = new Map();
    for (const p of memberList) {
      byPlayer.set(p.id, {
        player_id: p.id,
        display_name: p.display_name,
        score: null, // today's score
        avg: null,
        plays: 0,
        last_date: null,
        total: 0,
      });
    }
    for (const s of scores || []) {
      const row = byPlayer.get(s.player_id);
      if (!row) continue;
      row.plays += 1;
      row.total += s.score;
      if (s.date === today) row.score = s.score;
      if (!row.last_date || s.date > row.last_date) row.last_date = s.date;
    }
    for (const row of byPlayer.values()) {
      row.avg = row.plays > 0 ? Math.round(row.total / row.plays) : null;
    }
    const rows = [...byPlayer.values()];
    // Sort
    if (range === "today") {
      rows.sort((a, b) => {
        const sa = a.score == null ? -1 : a.score;
        const sb = b.score == null ? -1 : b.score;
        return sb - sa;
      });
    } else {
      rows.sort((a, b) => {
        const aa = a.avg == null ? -1 : a.avg;
        const bb = b.avg == null ? -1 : b.avg;
        return bb - aa;
      });
    }
    return { group, rows };
  }

  // YYYY-MM-DD for the local-time today.
  function todayKey() {
    const d = new Date();
    return isoDate(d);
  }
  function isoDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  Object.assign(window.Combine, {
    ensureSession,
    getPlayer,
    setDisplayName,
    createGroup,
    joinGroup,
    leaveGroup,
    listMyGroups,
    submitScore,
    getGroupLeaderboard,
    todayKey,
  });
})();
