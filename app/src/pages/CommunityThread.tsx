import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import Icon from '../components/Icon'

type PostType = 'question' | 'discussion' | 'alert'

interface Post {
  id: string
  user_id: string
  display_name: string
  type: PostType
  title: string | null
  content: string
  created_at: string
  post_votes: { count: number }[]
}

interface Reply {
  id: string
  user_id: string
  display_name: string
  content: string
  created_at: string
}

const TYPE_CONFIG: Record<PostType, { label: string; bg: string; text: string }> = {
  question:   { label: 'QUESTION',   bg: 'bg-primary-container',   text: 'text-on-primary-container' },
  discussion: { label: 'DISCUSSION', bg: 'bg-secondary-container', text: 'text-on-secondary-container' },
  alert:      { label: 'ALERT',      bg: 'bg-error-container',     text: 'text-on-error-container' },
}

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const initial = name?.[0]?.toUpperCase() ?? '?'
  const sz =
    size === 'sm' ? 'w-8 h-8 text-xs' :
    size === 'lg' ? 'w-12 h-12 text-base' :
    'w-10 h-10 text-sm'
  return (
    <div className={`${sz} rounded-full bg-primary-container flex items-center justify-center shrink-0`}>
      <span className="font-headline font-bold text-on-primary-container">{initial}</span>
    </div>
  )
}

export default function CommunityThread() {
  const { postId } = useParams<{ postId: string }>()
  const navigate = useNavigate()
  const { displayName, user, isLoggedIn } = useAuth()
  const effectiveDisplayName = displayName ?? 'Anonymous'
  const [post, setPost] = useState<Post | null>(null)
  const [replies, setReplies] = useState<Reply[]>([])
  const [voted, setVoted] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchPost = async () => {
    const { data } = await supabase
      .from('posts')
      .select('*, post_votes(count)')
      .eq('id', postId)
      .single()
    if (data) setPost(data as Post)
  }

  const fetchReplies = async () => {
    const { data } = await supabase
      .from('replies')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
    if (data) setReplies(data as Reply[])
  }

  const fetchVoteStatus = async () => {
    if (!postId || !user) return
    const { data } = await supabase
      .from('post_votes')
      .select('post_id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .maybeSingle()
    setVoted(!!data)
  }

  useEffect(() => {
    if (!postId) return
    fetchPost()
    fetchReplies()
    fetchVoteStatus()

    // Real-time: new replies stream in live
    const channel = supabase
      .channel(`replies:${postId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'replies', filter: `post_id=eq.${postId}` },
        payload => {
          setReplies(prev => {
            const exists = prev.some(r => r.id === payload.new.id)
            return exists ? prev : [...prev, payload.new as Reply]
          })
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [postId, user])

  const handleVote = async () => {
    if (!user) return // votes require real auth
    if (voted) {
      await supabase.from('post_votes').delete().eq('post_id', postId).eq('user_id', user.id)
      setVoted(false)
    } else {
      await supabase.from('post_votes').insert({ post_id: postId, user_id: user.id })
      setVoted(true)
    }
    fetchPost()
  }

  const handleReply = async () => {
    if (!replyText.trim() || !postId) return
    setSubmitting(true)
    await supabase.from('replies').insert({
      post_id: postId,
      user_id: user?.id ?? null,
      display_name: effectiveDisplayName,
      content: replyText.trim(),
    })
    setReplyText('')
    setSubmitting(false)
    // No manual fetchReplies needed — realtime handles it
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleReply()
    }
  }

  if (!post) {
    return (
      <main className="flex-grow flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </main>
    )
  }

  const cfg = TYPE_CONFIG[post.type]
  const voteCount = post.post_votes[0]?.count ?? 0

  return (
    <main className="flex-grow max-w-lg mx-auto w-full flex flex-col">
      {/* Thread header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-3 sticky top-[72px] bg-background z-10">
        <button
          onClick={() => navigate('/community')}
          className="flex items-center gap-1 text-primary font-headline font-bold cursor-pointer"
        >
          <Icon name="arrow_back" className="text-xl" />
          <span>Back</span>
        </button>
        <h2 className="font-headline font-extrabold text-xl text-on-surface">Thread</h2>
        <div className="w-16" />
      </div>

      {/* Scrollable content */}
      <div className="flex-grow px-4 pb-36 overflow-y-auto">
        {/* Original post */}
        <div className="bg-surface-container-lowest rounded-[1.5rem] p-5 shadow-[0_4px_0_0_#bcb9b3] mb-6">
          <span className={`${cfg.bg} ${cfg.text} text-[10px] font-headline font-black uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-4`}>
            {cfg.label}
          </span>
          <div className="flex items-center gap-3 mb-4">
            <Avatar name={post.display_name} size="lg" />
            <div>
              <p className="font-headline font-bold text-on-surface">{post.display_name}</p>
              <p className="text-xs text-on-surface-variant">{timeAgo(post.created_at)}</p>
            </div>
          </div>
          {post.title && (
            <h1 className="font-headline font-extrabold text-xl text-on-surface mb-3 leading-snug">
              {post.title}
            </h1>
          )}
          <p className="text-on-surface leading-relaxed">{post.content}</p>

          {/* Post stats */}
          <div className="flex items-center gap-5 mt-4 pt-4 border-t border-outline-variant/30">
            <button
              onClick={handleVote}
              className={`flex items-center gap-1.5 transition-all cursor-pointer ${voted ? 'text-error' : 'text-on-surface-variant'}`}
            >
              <Icon name="favorite" filled={voted} className="text-lg" />
              <span className="font-headline font-bold text-sm">{voteCount}</span>
            </button>
            <div className="flex items-center gap-1.5 text-secondary">
              <Icon name="chat_bubble" className="text-lg" />
              <span className="font-headline font-bold text-sm">
                {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
              </span>
            </div>
            {/* Live indicator */}
            <div className="ml-auto flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse block" />
              <span className="text-xs text-on-surface-variant font-body">Live</span>
            </div>
          </div>
        </div>

        {/* Replies */}
        {replies.length === 0 ? (
          <p className="text-center text-on-surface-variant py-8 text-sm">
            No replies yet — be the first to respond.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {replies.map((reply, i) => (
              <div
                key={reply.id}
                className="bg-surface-container rounded-[1.25rem] p-4 shadow-[0_3px_0_0_#bcb9b3]"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <Avatar name={reply.display_name} size="sm" />
                  <div>
                    <p className="font-headline font-bold text-sm text-on-surface">{reply.display_name}</p>
                    <p className="text-xs text-on-surface-variant">{timeAgo(reply.created_at)}</p>
                  </div>
                </div>
                <p className="text-on-surface text-sm leading-relaxed">{reply.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sticky reply bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface-container-low border-t border-outline-variant/30 px-4 py-3 z-40">
        <div className="max-w-lg mx-auto">
          {isLoggedIn ? (
            <div className="flex items-end gap-3">
              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write a supportive reply..."
                rows={1}
                className="flex-grow bg-surface-container rounded-xl px-4 py-3 text-on-surface text-sm font-body outline-none resize-none placeholder:text-on-surface-variant focus:ring-2 focus:ring-primary/30"
              />
              <button
                onClick={handleReply}
                disabled={!replyText.trim() || submitting}
                className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shadow-[0_3px_0_0_#612f00] active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50 shrink-0 cursor-pointer disabled:cursor-not-allowed"
              >
                <Icon name="send" className="text-on-primary text-base" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-primary text-on-primary font-headline font-bold py-3.5 rounded-xl shadow-[0_4px_0_0_#612f00] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
            >
              Sign in to reply
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
