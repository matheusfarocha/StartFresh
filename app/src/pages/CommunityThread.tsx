import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

type PostType = 'question' | 'discussion' | 'alert'

interface Post {
  id: string
  user_id: string | null
  display_name: string | null
  type: PostType
  title: string
  body: string
  upvotes: number
  created_at: string
}

interface Reply {
  id: string
  post_id: string
  user_id: string | null
  display_name: string | null
  body: string
  upvotes: number
  created_at: string
}

const TYPE_CONFIG: Record<PostType, { label: string; color: string; bg: string }> = {
  question:   { label: 'QUESTION',   color: 'text-[#9d4f00]',   bg: 'bg-[#9d4f00]/10' },
  discussion: { label: 'DISCUSSION', color: 'text-[#007164]', bg: 'bg-[#007164]/10' },
  alert:      { label: 'ALERT',      color: 'text-red-600',     bg: 'bg-red-100' },
}

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return `${Math.floor(seconds / 604800)}w ago`
}

function Avatar({ name, size = 36 }: { name: string | null; size?: number }) {
  const initials = (name ?? 'G').slice(0, 2).toUpperCase()
  const colors = ['#9d4f00', '#007164', '#1a56db', '#7e3af2', '#057a55']
  const color = colors[(name?.charCodeAt(0) ?? 0) % colors.length]
  return (
    <div
      style={{ width: size, height: size, backgroundColor: color, fontSize: size * 0.4 }}
      className="rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
    >
      {initials}
    </div>
  )
}

export default function CommunityThread() {
  const { postId } = useParams<{ postId: string }>()
  const navigate = useNavigate()
  const { user, displayName } = useAuth()

  const [post, setPost] = useState<Post | null>(null)
  const [replies, setReplies] = useState<Reply[]>([])
  const [replyBody, setReplyBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [upvoted, setUpvoted] = useState(false)
  const [upvotedReplies, setUpvotedReplies] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const repliesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!postId) return

    const load = async () => {
      const [{ data: postData }, { data: repliesData }] = await Promise.all([
        supabase.from('posts').select('*').eq('id', postId).single(),
        supabase.from('replies').select('*').eq('post_id', postId).order('created_at', { ascending: true }),
      ])
      if (postData) setPost(postData)
      if (repliesData) setReplies(repliesData)
      setLoading(false)
    }
    load()

    const channel = supabase
      .channel(`replies:${postId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'replies', filter: `post_id=eq.${postId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setReplies((prev) => [...prev, payload.new as Reply])
          } else if (payload.eventType === 'DELETE') {
            setReplies((prev) => prev.filter((r) => r.id !== payload.old.id))
          } else if (payload.eventType === 'UPDATE') {
            setReplies((prev) => prev.map((r) => (r.id === payload.new.id ? (payload.new as Reply) : r)))
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [postId])

  const handleUpvotePost = async () => {
    if (!post || !user) return
    const delta = upvoted ? -1 : 1
    setUpvoted(!upvoted)
    setPost((p) => p ? { ...p, upvotes: p.upvotes + delta } : p)
    await supabase.from('posts').update({ upvotes: post.upvotes + delta }).eq('id', post.id)
  }

  const handleUpvoteReply = async (reply: Reply) => {
    if (!user) return
    const wasUpvoted = upvotedReplies.has(reply.id)
    const delta = wasUpvoted ? -1 : 1
    setUpvotedReplies((prev) => {
      const next = new Set(prev)
      wasUpvoted ? next.delete(reply.id) : next.add(reply.id)
      return next
    })
    setReplies((prev) => prev.map((r) => r.id === reply.id ? { ...r, upvotes: r.upvotes + delta } : r))
    await supabase.from('replies').update({ upvotes: reply.upvotes + delta }).eq('id', reply.id)
  }

  const handleDeletePost = async () => {
    if (!post || !user || user.id !== post.user_id) return
    if (!confirm('Delete this post and all its replies?')) return
    await supabase.from('replies').delete().eq('post_id', post.id)
    await supabase.from('posts').delete().eq('id', post.id)
    navigate('/community')
  }

  const handleDeleteReply = async (reply: Reply) => {
    if (!user || user.id !== reply.user_id) return
    await supabase.from('replies').delete().eq('id', reply.id)
  }

  const handleSubmitReply = async () => {
    if (!replyBody.trim() || !postId) return
    setSubmitting(true)
    const name = user ? (displayName ?? user.email ?? 'Member') : 'Guest'
    await supabase.from('replies').insert({
      post_id: postId,
      user_id: user?.id ?? null,
      display_name: name,
      body: replyBody.trim(),
      upvotes: 0,
    })
    setReplyBody('')
    setSubmitting(false)
    setTimeout(() => repliesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdf8f0] flex items-center justify-center">
        <div className="text-[#9d4f00] font-semibold">Loading thread...</div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#fdf8f0] flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-2">Post not found</div>
          <button onClick={() => navigate('/community')} className="text-[#9d4f00] underline">Back to community</button>
        </div>
      </div>
    )
  }

  const cfg = TYPE_CONFIG[post.type]

  return (
    <div className="min-h-screen bg-[#fdf8f0]">
      <div className="max-w-2xl mx-auto px-4 py-6 pb-32">
        {/* Back button */}
        <button
          onClick={() => navigate('/community')}
          className="flex items-center gap-1 text-[#9d4f00] font-semibold mb-6 hover:opacity-80 transition-opacity"
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
          Community Feed
        </button>

        {/* Post card */}
        <div className="bg-white rounded-2xl shadow-[4px_4px_0px_#9d4f00] border-0 p-6 mb-6">
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <Avatar name={post.display_name} size={44} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-gray-900">{post.display_name ?? 'Guest'}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.color} ${cfg.bg}`}>
                  {cfg.label}
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-0.5">{timeAgo(post.created_at)}</div>
            </div>
            {user && user.id === post.user_id && (
              <button
                onClick={handleDeletePost}
                className="text-red-400 hover:text-red-600 transition-colors p-1"
                title="Delete post"
              >
                <span className="material-symbols-outlined text-xl">delete</span>
              </button>
            )}
          </div>

          <h1 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h1>
          {post.body && <p className="text-gray-700 leading-relaxed mb-4">{post.body}</p>}

          {/* Upvote row */}
          <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
            <button
              onClick={handleUpvotePost}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold text-sm transition-all ${
                upvoted
                  ? 'bg-[#9d4f00] text-white shadow-[2px_2px_0px_#7a3c00]'
                  : 'bg-[#9d4f00]/10 text-[#9d4f00] hover:bg-[#9d4f00]/20'
              }`}
            >
              <span className="material-symbols-outlined text-base">thumb_up</span>
              {post.upvotes}
            </button>
            <span className="text-sm text-gray-400 flex items-center gap-1">
              <span className="material-symbols-outlined text-base">chat_bubble_outline</span>
              {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
            </span>
          </div>
        </div>

        {/* Replies */}
        <div className="space-y-4">
          {replies.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <span className="material-symbols-outlined text-4xl block mb-2">forum</span>
              No replies yet — be the first to respond!
            </div>
          )}
          {replies.map((reply) => (
            <div key={reply.id} className="bg-white rounded-xl shadow-[3px_3px_0px_#007164]/40 p-4">
              <div className="flex items-start gap-3">
                <Avatar name={reply.display_name} size={36} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-gray-900">{reply.display_name ?? 'Guest'}</span>
                    <span className="text-xs text-gray-400">{timeAgo(reply.created_at)}</span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{reply.body}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => handleUpvoteReply(reply)}
                      className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full transition-all ${
                        upvotedReplies.has(reply.id)
                          ? 'bg-[#007164] text-white'
                          : 'text-[#007164] hover:bg-[#007164]/10'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">thumb_up</span>
                      {reply.upvotes}
                    </button>
                    {user && user.id === reply.user_id && (
                      <button
                        onClick={() => handleDeleteReply(reply)}
                        className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={repliesEndRef} />
        </div>
      </div>

      {/* Sticky reply bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg px-4 py-3 z-50">
        <div className="max-w-2xl mx-auto flex items-end gap-2">
          <Avatar name={user ? (displayName ?? user.email) : 'Guest'} size={36} />
          <div className="flex-1 bg-gray-50 rounded-2xl border border-gray-200 px-4 py-2">
            <textarea
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmitReply()
                }
              }}
              placeholder="Write a reply..."
              rows={1}
              className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none"
              style={{ maxHeight: 120, overflowY: 'auto' }}
            />
          </div>
          <button
            onClick={handleSubmitReply}
            disabled={!replyBody.trim() || submitting}
            className="bg-[#9d4f00] text-white rounded-full w-10 h-10 flex items-center justify-center shadow-[2px_2px_0px_#7a3c00] hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-lg">send</span>
          </button>
        </div>
      </div>
    </div>
  )
}
