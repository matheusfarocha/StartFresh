import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import Icon from '../components/Icon'

type PostType = 'question' | 'discussion' | 'alert'
type FilterType = 'all' | PostType
type SortType = 'recent' | 'trending'

interface Post {
  id: string
  user_id: string
  display_name: string
  type: PostType
  title: string | null
  content: string
  created_at: string
  replies: { count: number }[]
  post_votes: { count: number }[]
}

const TYPE_CONFIG: Record<PostType, { label: string; color: string; bg: string }> = {
  question:   { label: 'QUESTION',   color: 'text-primary',   bg: 'bg-primary-container/60' },
  discussion: { label: 'DISCUSSION', color: 'text-secondary', bg: 'bg-secondary-container/60' },
  alert:      { label: 'ALERT',      color: 'text-error',     bg: 'bg-error-container/60' },
}

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}h ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

function ComposeModal({ onClose, onPost, displayName }: {
  onClose: () => void; onPost: () => void; displayName: string
}) {
  const [type, setType] = useState<PostType>('discussion')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const guestUser = user ?? { id: null }

  const handleSubmit = async () => {
    if (!content.trim()) return
    setLoading(true)
    const { error } = await supabase.from('posts').insert({
      user_id: guestUser.id,
      display_name: displayName,
      type,
      title: title.trim() || null,
      content: content.trim(),
    })
    if (error) { console.error('Post error:', error); setLoading(false); return }
    setLoading(false)
    onPost()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="font-headline font-extrabold text-xl text-on-surface">New Post</h2>
          <button onClick={onClose} className="text-on-surface-variant cursor-pointer hover:text-on-surface">
            <Icon name="close" className="text-2xl" />
          </button>
        </div>

        <div className="p-6">
          {/* Type selector */}
          <div className="flex gap-2 mb-5">
            {(['discussion', 'question', 'alert'] as PostType[]).map(t => {
              const cfg = TYPE_CONFIG[t]
              const active = type === t
              return (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`px-4 py-1.5 rounded-full text-xs font-headline font-bold transition-all cursor-pointer border-2 ${
                    active
                      ? `${cfg.bg} ${cfg.color} border-transparent`
                      : 'bg-transparent border-outline-variant text-on-surface-variant'
                  }`}
                >
                  {cfg.label}
                </button>
              )
            })}
          </div>

          <input
            placeholder="Title (optional but recommended)"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full border-b-2 border-outline-variant focus:border-primary bg-transparent px-0 py-3 text-on-surface font-headline font-bold text-lg mb-4 outline-none placeholder:text-on-surface-variant placeholder:font-normal placeholder:text-base transition-colors"
          />

          <textarea
            placeholder="Share your experience, ask a question, or post a community alert..."
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={5}
            className="w-full bg-surface-container rounded-xl px-4 py-3 text-on-surface font-body text-sm mb-6 outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant resize-none leading-relaxed"
          />

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl font-headline font-bold text-on-surface-variant bg-surface-container cursor-pointer hover:bg-surface-container-high transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || loading}
              className="flex-1 py-3 rounded-xl font-headline font-bold bg-primary text-on-primary shadow-[0_4px_0_0_#612f00] active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? 'Posting...' : 'Post to Community'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Community() {
  const [posts, setPosts] = useState<Post[]>([])
  const [sort, setSort] = useState<SortType>('recent')
  const [filter, setFilter] = useState<FilterType>('all')
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set())
  const [showCompose, setShowCompose] = useState(false)
  const [loading, setLoading] = useState(true)
  const { displayName, user, isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const effectiveDisplayName = displayName ?? 'Anonymous'

  const fetchPosts = async () => {
    const { data } = await supabase
      .from('posts')
      .select('*, replies(count), post_votes(count)')
      .order('created_at', { ascending: false })
    if (data) setPosts(data as Post[])
    setLoading(false)
  }

  const fetchUserVotes = async () => {
    if (!user) return
    const { data } = await supabase.from('post_votes').select('post_id').eq('user_id', user.id)
    if (data) setUserVotes(new Set(data.map(v => v.post_id)))
  }

  useEffect(() => { fetchPosts(); fetchUserVotes() }, [user])

  const handleVote = async (e: React.MouseEvent, postId: string) => {
    e.stopPropagation()
    if (!user) return
    if (userVotes.has(postId)) {
      await supabase.from('post_votes').delete().eq('post_id', postId).eq('user_id', user.id)
      setUserVotes(prev => { const next = new Set(prev); next.delete(postId); return next })
    } else {
      await supabase.from('post_votes').insert({ post_id: postId, user_id: user.id })
      setUserVotes(prev => new Set([...prev, postId]))
    }
    fetchPosts()
  }

  const filters: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'question', label: 'Questions' },
    { value: 'discussion', label: 'Discussions' },
    { value: 'alert', label: 'Alerts' },
  ]

  const visible = [...posts]
    .filter(p => filter === 'all' || p.type === filter)
    .sort((a, b) =>
      sort === 'trending'
        ? (b.replies[0]?.count ?? 0) - (a.replies[0]?.count ?? 0)
        : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

  return (
    <main className="flex-grow w-full">

      {/* Page header */}
      <div className="border-b border-outline-variant/30 bg-surface-container-low px-6 py-4 flex items-center justify-between sticky top-[72px] z-10">
        <div>
          <h1 className="font-headline font-extrabold text-2xl text-on-surface">Community Feed</h1>
          <p className="text-on-surface-variant text-xs mt-0.5">A safe space to ask questions, share updates, and support each other.</p>
        </div>
        {isLoggedIn && (
          <button
            onClick={() => setShowCompose(true)}
            className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-full font-headline font-bold text-sm shadow-[0_4px_0_0_#612f00] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
          >
            <Icon name="edit" className="text-sm" />
            New Post
          </button>
        )}
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5">

        {/* Sort + Filter row */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {/* Sort pills */}
          {(['recent', 'trending'] as SortType[]).map(s => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`px-4 py-1.5 rounded-full font-headline font-bold text-sm transition-all cursor-pointer ${
                sort === s
                  ? 'bg-primary text-on-primary shadow-[0_3px_0_0_#612f00]'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {s === 'recent' ? 'Recent' : 'Trending'}
            </button>
          ))}

          <div className="w-px h-5 bg-outline-variant mx-1" />

          {/* Type filters */}
          {filters.map(f => {
            const active = filter === f.value
            const cfg = f.value !== 'all' ? TYPE_CONFIG[f.value as PostType] : null
            return (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-1.5 rounded-full text-sm font-headline font-bold transition-all cursor-pointer ${
                  active && cfg ? `${cfg.bg} ${cfg.color}` :
                  active ? 'bg-on-surface text-background' :
                  'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {f.label}
              </button>
            )
          })}
        </div>

        {/* Feed */}
        {loading ? (
          <div className="flex flex-col divide-y divide-outline-variant/20">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="py-5 flex gap-4 animate-pulse">
                <div className="w-10 flex flex-col items-center gap-1">
                  <div className="w-5 h-5 bg-surface-container-high rounded" />
                  <div className="w-6 h-4 bg-surface-container-high rounded" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-surface-container-high rounded w-1/3" />
                  <div className="h-5 bg-surface-container-high rounded w-3/4" />
                  <div className="h-3 bg-surface-container-high rounded w-full" />
                  <div className="h-3 bg-surface-container-high rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-24">
            <span className="material-symbols-outlined text-primary text-5xl mb-3 block">forum</span>
            <h3 className="font-headline font-bold text-xl text-on-surface mb-2">Nothing here yet</h3>
            <p className="text-on-surface-variant text-sm mb-6">
              {filter === 'all' ? 'Be the first to post.' : `No ${filter}s yet.`}
            </p>
            <button
              onClick={() => setShowCompose(true)}
              className="bg-primary text-on-primary font-headline font-bold px-6 py-3 rounded-full shadow-[0_4px_0_0_#612f00] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
            >
              Start the conversation
            </button>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-outline-variant/20">
            {visible.map(post => {
              const cfg = TYPE_CONFIG[post.type]
              const replyCount = post.replies[0]?.count ?? 0
              const voteCount = post.post_votes[0]?.count ?? 0
              const voted = userVotes.has(post.id)

              return (
                <div key={post.id} className="py-5 flex gap-4 group">
                  {/* Upvote column */}
                  <div className="flex flex-col items-center gap-0.5 pt-1 shrink-0 w-10">
                    <button
                      onClick={e => handleVote(e, post.id)}
                      className={`flex flex-col items-center cursor-pointer transition-all hover:scale-110 active:scale-95 ${voted ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}
                    >
                      <Icon name="arrow_drop_up" className="text-3xl -mb-1" filled={voted} />
                      <span className="font-headline font-extrabold text-sm leading-none">{voteCount}</span>
                    </button>
                  </div>

                  {/* Content */}
                  <button
                    className="flex-1 text-left cursor-pointer"
                    onClick={() => navigate(`/community/${post.id}`)}
                  >
                    {/* Meta row */}
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className={`text-[11px] font-headline font-black uppercase tracking-wider ${cfg.color}`}>
                        {cfg.label}
                      </span>
                      <span className="text-outline-variant text-xs">·</span>
                      <span className="text-xs text-on-surface-variant font-medium">{post.display_name}</span>
                      <span className="text-outline-variant text-xs">·</span>
                      <span className="text-xs text-on-surface-variant">{timeAgo(post.created_at)}</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-headline font-extrabold text-lg text-on-surface leading-snug mb-1.5 group-hover:text-primary transition-colors">
                      {post.title ?? post.content}
                    </h3>

                    {/* Body preview */}
                    {post.title && (
                      <p className="text-on-surface-variant text-sm leading-relaxed line-clamp-2 mb-3">
                        {post.content}
                      </p>
                    )}

                    {/* Reply count */}
                    <div className="flex items-center gap-1.5 text-on-surface-variant">
                      <Icon name="chat_bubble_outline" className="text-base" />
                      <span className="text-xs font-headline font-bold">
                        {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
                      </span>
                    </div>
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* FAB fallback */}
      {isLoggedIn && (
        <button
          onClick={() => setShowCompose(true)}
          className="fixed bottom-8 right-6 w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-[0_6px_0_0_#612f00] active:translate-y-1 active:shadow-none transition-all z-40 cursor-pointer sm:hidden"
        >
          <Icon name="edit" className="text-on-primary text-2xl" />
        </button>
      )}

      {showCompose && (
        <ComposeModal
          onClose={() => setShowCompose(false)}
          onPost={() => { setShowCompose(false); fetchPosts() }}
          displayName={effectiveDisplayName}
        />
      )}
    </main>
  )
}
