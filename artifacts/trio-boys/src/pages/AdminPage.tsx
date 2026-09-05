import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  createAdminPost,
  deleteAdminPost,
  getGetAdminProfileQueryKey,
  getListAdminPostsQueryKey,
  getListAdminSubscribersQueryKey,
  loginAdmin,
  logoutAdmin,
  removeAdminSubscriber,
  sendAdminPost,
  updateAdminPost,
  useGetAdminProfile,
  useListAdminPosts,
  useListAdminSubscribers,
} from "@workspace/api-client-react";
import type { Post } from "@workspace/api-client-react";
import { ArrowLeft, Check, ChevronRight, FileText, LogOut, Mail, Plus, Send, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Draft = {
  title: string;
  excerpt: string;
  body: string;
  coverImageUrl: string;
  status: "draft" | "published";
};

const blankDraft: Draft = { title: "", excerpt: "", body: "", coverImageUrl: "", status: "draft" };

function formatDate(value?: string | null) {
  return value ? new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value)) : "—";
}

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await loginAdmin({ username, password });
      onSuccess();
    } catch {
      setError("That username or password is not correct.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#080a0e] px-6 py-20 text-white">
      <div className="mx-auto max-w-xl border border-white/10 bg-white/[0.03] p-8 md:p-12">
        <p className="mb-4 text-xs font-bold tracking-[0.3em] text-[#00f5ff]">TRIO BOYS / PRIVATE STUDIO</p>
        <h1 className="font-display text-4xl font-black">Log in to publish.</h1>
        <p className="mt-4 text-sm leading-7 text-white/55">This private studio uses a local administrator login. Your session stays on this site.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block"><span className="mb-2 block text-[10px] font-bold tracking-[0.2em] text-white/45">USERNAME</span><Input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" className="h-12 rounded-none border-white/15 bg-white/[0.03] text-white" /></label>
          <label className="block"><span className="mb-2 block text-[10px] font-bold tracking-[0.2em] text-white/45">PASSWORD</span><Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" className="h-12 rounded-none border-white/15 bg-white/[0.03] text-white" /></label>
          {error && <p className="text-sm text-red-300">{error}</p>}
          <Button type="submit" disabled={busy || !username || !password} className="h-12 rounded-none bg-[#00f5ff] px-7 font-bold tracking-[0.16em] text-[#080a0e] hover:bg-[#dfff00]">{busy ? "CHECKING…" : "LOG IN"}</Button>
        </form>
      </div>
    </main>
  );
}

function AdminDashboard({ profile, onLoggedOut }: { profile: { username: string }; onLoggedOut: () => void }) {
  const queryClient = useQueryClient();
  const { data: posts = [], isLoading: postsLoading } = useListAdminPosts();
  const { data: subscribers = [], isLoading: subscribersLoading } = useListAdminSubscribers();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Draft>(blankDraft);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  const selectedPost = useMemo(() => posts.find((post) => post.id === selectedId), [posts, selectedId]);

  useEffect(() => {
    if (selectedPost) {
      setDraft({
        title: selectedPost.title,
        excerpt: selectedPost.excerpt ?? "",
        body: selectedPost.body,
        coverImageUrl: selectedPost.coverImageUrl ?? "",
        status: selectedPost.status,
      });
    }
  }, [selectedPost]);

  const saveDraft = async (status: "draft" | "published" = "draft") => {
    if (!draft.title.trim() || !draft.body.trim()) {
      setNotice("Add a title and body before saving.");
      return;
    }
    setBusy(true);
    setNotice("");
    try {
      const input = { ...draft, status, title: draft.title.trim(), body: draft.body.trim() };
      if (selectedId) {
        await updateAdminPost(selectedId, input);
      } else {
        const created = await createAdminPost(input);
        setSelectedId(created.id);
      }
      await queryClient.invalidateQueries({ queryKey: getListAdminPostsQueryKey() });
      setNotice(status === "published" ? "Post marked published. Review it, then send when ready." : "Draft saved.");
    } catch {
      setNotice("Could not save this post. Check the API workflow and try again.");
    } finally {
      setBusy(false);
    }
  };

  const sendSelected = async () => {
    if (!selectedId) return;
    if (!window.confirm("Send this post to every active subscriber?")) return;
    setBusy(true);
    setNotice("");
    try {
      const result = await sendAdminPost(selectedId);
      setNotice(`Sent to ${result.sent} subscriber${result.sent === 1 ? "" : "s"}${result.failed ? ` · ${result.failed} failed` : ""}.`);
      await queryClient.invalidateQueries({ queryKey: getListAdminPostsQueryKey() });
    } catch {
      setNotice("The send did not complete. Confirm RESEND_FROM_EMAIL is configured and verified.");
    } finally {
      setBusy(false);
    }
  };

  const newPost = () => {
    setSelectedId(null);
    setDraft(blankDraft);
    setNotice("");
  };

  const removePost = async (post: Post) => {
    if (!window.confirm(`Delete “${post.title}”?`)) return;
    await deleteAdminPost(post.id);
    if (selectedId === post.id) newPost();
    await queryClient.invalidateQueries({ queryKey: getListAdminPostsQueryKey() });
  };

  const removeSubscriber = async (id: number) => {
    await removeAdminSubscriber(id);
    await queryClient.invalidateQueries({ queryKey: getListAdminSubscribersQueryKey() });
  };

  return (
    <main className="min-h-screen bg-[#080a0e] text-white">
      <header className="border-b border-white/10 bg-[#0d1016]/90 px-5 py-4 md:px-10">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-white/50 transition-colors hover:text-[#00f5ff]" aria-label="Back to Trio Boys"><ArrowLeft size={18} /></Link>
            <div>
              <p className="text-[10px] font-bold tracking-[0.3em] text-[#00f5ff]">TRIO BOYS</p>
              <p className="font-display text-lg font-black tracking-tight">PRIVATE STUDIO</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-white/45 md:block">{profile.username}</span>
            <Button variant="ghost" size="sm" className="rounded-none text-white/60 hover:text-white" onClick={async () => { await logoutAdmin(); onLoggedOut(); }}><LogOut size={15} className="mr-2" />LOG OUT</Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-5 py-8 md:px-10 md:py-12">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs font-bold tracking-[0.3em] text-[#dfff00]">CONTENT CONTROL ROOM</p>
            <h1 className="font-display text-4xl font-black tracking-tight md:text-6xl">Send the next drop.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/50">Write a post, keep it in drafts, publish it when it’s ready, and send it to the people who opted in.</p>
          </div>
          <Button onClick={newPost} className="h-11 rounded-none bg-[#dfff00] px-5 font-bold tracking-[0.14em] text-[#080a0e] hover:bg-[#00f5ff]"><Plus size={16} className="mr-2" />NEW POST</Button>
        </div>

        <div className="mb-8 grid gap-3 sm:grid-cols-3">
          {[
            { label: "ACTIVE SUBSCRIBERS", value: subscribers.filter((subscriber) => subscriber.status === "active").length, icon: Mail },
            { label: "TOTAL POSTS", value: posts.length, icon: FileText },
            { label: "LOGGED IN AS", value: profile.username, icon: Check },
          ].map((stat) => (
            <div key={stat.label} className="border border-white/10 bg-white/[0.03] p-5">
              <stat.icon size={16} className="mb-5 text-[#00f5ff]" />
              <p className="font-display text-3xl font-black">{stat.value}</p>
              <p className="mt-1 text-[10px] font-bold tracking-[0.18em] text-white/45">{stat.label}</p>
            </div>
          ))}
        </div>

        {notice && <div className="mb-5 border border-[#00f5ff]/30 bg-[#00f5ff]/5 px-4 py-3 text-sm text-[#b9fbff]">{notice}</div>}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_370px]">
          <section className="border border-white/10 bg-[#0d1016]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <p className="text-[10px] font-bold tracking-[0.25em] text-white/40">EDITOR</p>
                <p className="mt-1 text-sm text-white/70">{selectedId ? `Editing post #${selectedId}` : "Untitled draft"}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="h-9 rounded-none border-white/15 text-xs tracking-[0.12em]" disabled={busy} onClick={() => saveDraft("draft")}>SAVE DRAFT</Button>
                <Button className="h-9 rounded-none bg-[#00f5ff] text-xs font-bold tracking-[0.12em] text-[#080a0e] hover:bg-[#dfff00]" disabled={busy} onClick={() => saveDraft("published")}>PUBLISH</Button>
              </div>
            </div>
            <div className="space-y-5 p-5 md:p-8">
              <label className="block"><span className="mb-2 block text-[10px] font-bold tracking-[0.2em] text-white/40">TITLE</span><Input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="A headline worth opening" className="h-12 rounded-none border-white/15 bg-white/[0.03] text-base text-white placeholder:text-white/20" /></label>
              <label className="block"><span className="mb-2 block text-[10px] font-bold tracking-[0.2em] text-white/40">DECK / EXCERPT</span><Input value={draft.excerpt} onChange={(event) => setDraft({ ...draft, excerpt: event.target.value })} placeholder="One sentence to pull people in" className="h-12 rounded-none border-white/15 bg-white/[0.03] text-white placeholder:text-white/20" /></label>
              <label className="block"><span className="mb-2 block text-[10px] font-bold tracking-[0.2em] text-white/40">COVER IMAGE URL <span className="font-normal tracking-normal text-white/25">(optional)</span></span><Input value={draft.coverImageUrl} onChange={(event) => setDraft({ ...draft, coverImageUrl: event.target.value })} placeholder="https://…" className="h-12 rounded-none border-white/15 bg-white/[0.03] text-white placeholder:text-white/20" /></label>
              <label className="block"><span className="mb-2 block text-[10px] font-bold tracking-[0.2em] text-white/40">BODY</span><Textarea value={draft.body} onChange={(event) => setDraft({ ...draft, body: event.target.value })} placeholder="Write the story. Use a blank line to start a new paragraph." className="min-h-[330px] resize-y rounded-none border-white/15 bg-white/[0.03] text-base leading-7 text-white placeholder:text-white/20" /></label>
              {selectedId && <Button variant="ghost" className="rounded-none px-0 text-xs tracking-[0.12em] text-red-300 hover:bg-transparent hover:text-red-200" onClick={() => { const post = posts.find((item) => item.id === selectedId); if (post) void removePost(post); }}><Trash2 size={14} className="mr-2" />DELETE THIS POST</Button>}
              {selectedId && <Button className="float-right rounded-none bg-[#dfff00] text-xs font-bold tracking-[0.12em] text-[#080a0e] hover:bg-[#00f5ff]" disabled={busy || !selectedPost} onClick={() => void sendSelected()}><Send size={14} className="mr-2" />SEND TO SUBSCRIBERS</Button>}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="border border-white/10 bg-[#0d1016]">
              <div className="border-b border-white/10 px-5 py-4"><p className="text-[10px] font-bold tracking-[0.25em] text-white/40">RECENT POSTS</p></div>
              <div className="divide-y divide-white/10">
                {postsLoading && <p className="p-5 text-sm text-white/40">Loading posts…</p>}
                {!postsLoading && !posts.length && <p className="p-5 text-sm leading-6 text-white/40">No posts yet. Start with a draft.</p>}
                {posts.map((post) => (
                  <button key={post.id} type="button" onClick={() => setSelectedId(post.id)} className={`flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-white/[0.04] ${selectedId === post.id ? "bg-[#00f5ff]/5" : ""}`}>
                    <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{post.title}</p><p className="mt-1 text-[10px] tracking-[0.12em] text-white/35">{post.status.toUpperCase()} · {formatDate(post.updatedAt)}</p></div>
                    <ChevronRight size={15} className="shrink-0 text-white/25" />
                  </button>
                ))}
              </div>
            </section>

            <section className="border border-white/10 bg-[#0d1016]">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4"><p className="text-[10px] font-bold tracking-[0.25em] text-white/40">SUBSCRIBERS</p><span className="text-xs text-[#00f5ff]">{subscribers.length}</span></div>
              <div className="max-h-[330px] divide-y divide-white/10 overflow-auto">
                {subscribersLoading && <p className="p-5 text-sm text-white/40">Loading subscribers…</p>}
                {!subscribersLoading && !subscribers.length && <p className="p-5 text-sm leading-6 text-white/40">Subscriber emails will appear here when people join the public list.</p>}
                {subscribers.map((subscriber) => (
                  <div key={subscriber.id} className="flex items-center gap-3 px-5 py-3">
                    <Mail size={14} className="shrink-0 text-white/30" />
                    <div className="min-w-0 flex-1"><p className="truncate text-sm text-white/75">{subscriber.email}</p><p className="text-[10px] tracking-[0.1em] text-white/30">{formatDate(subscriber.subscribedAt)}</p></div>
                    {subscriber.status === "active" && <button type="button" onClick={() => void removeSubscriber(subscriber.id)} className="text-[10px] font-bold tracking-[0.12em] text-white/30 hover:text-red-300">REMOVE</button>}
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default function AdminPage() {
  const queryClient = useQueryClient();
  const { data: profile, isLoading, isError } = useGetAdminProfile({
    query: { queryKey: getGetAdminProfileQueryKey(), retry: false },
  });
  const refreshProfile = () => {
    void queryClient.invalidateQueries({ queryKey: getGetAdminProfileQueryKey() });
  };

  if (isLoading) return <div className="flex min-h-screen items-center justify-center bg-[#080a0e] text-xs tracking-[0.25em] text-[#00f5ff]">LOADING…</div>;
  if (isError || !profile) return <AdminLogin onSuccess={refreshProfile} />;
  return <AdminDashboard profile={profile} onLoggedOut={refreshProfile} />;
}