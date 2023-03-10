import { format, formatDistanceToNow, isDate } from 'date-fns'
import { toDate } from 'date-fns/esm';
import ptBR from 'date-fns/locale/pt-BR'
import { Database } from 'phosphor-react';
import { ChangeEvent, FormEvent, InvalidEvent, useState } from 'react';

import { Avatar } from './Avatar';
import { Comment, } from './Comment';

import styles from './Post.module.css';

interface Author {
  author: string;
  avatarUrl: string;
  role: string;
}

interface Content {
  type: 'paragraph' | 'link';
  content: string;
}

export interface PostProps {
  author: Author;
  publishedAt: Date;
  content: Content[];
}

export function Post({ author, publishedAt, content }: PostProps) {
  const [comments, setComments] = useState([
    'post muito bacana, hein?'
])

  const [newCommentText, setNewCommentText] = useState('')

  const publishedDateFormatted = format(publishedAt, "d 'de' LLLL 'às' HH:mm'h'", {
    locale: ptBR,
  });

  const publishedDateRelativeToNow = formatDistanceToNow(publishedAt, {
    locale: ptBR,
    addSuffix: true,
  })

  function handleCreateNewComment(event: FormEvent) {
    event.preventDefault();

    setComments([newCommentText,...comments]);

    setNewCommentText('');
  }

  function handleNewCommentChange(event: ChangeEvent<HTMLTextAreaElement>) {
    event.target.setCustomValidity('')
    setNewCommentText(event.target.value);
  }

  function handleInvalidComment(event: InvalidEvent<HTMLTextAreaElement>) {
    event.target.setCustomValidity('Este campo deve ser preenchido!')
  }

  function deleteComment(commentToDelete: string) {
    const commentWithoutDeletedOn = comments.filter( comment => {
      return comment !== commentToDelete
    })
    
      setComments(commentWithoutDeletedOn)
  }

  const isNewCommentEmpty = newCommentText.length === 0

  return(
    <article className={ styles.post }>
      <header>
        <div className={ styles.author }>
          <Avatar
            src={author.avatarUrl} 
          />
          <div className={ styles.authorInfo }>
            <strong>{author.author}</strong>
            <span>{author.role}</span>
          </div>
        </div>

        <time 
          title={publishedDateFormatted} 
          dateTime={publishedAt.toISOString()}>
          {publishedDateRelativeToNow}
        </time>
      </header>

      <div className={ styles.content }>
        {content.map(line => {
          if (line.type === 'paragraph') {
            return <p key={line.content}>{line.content}</p>
          } else if (line.type === 'link') {
            return <p key={line.content}><a href="">{line.content}</a></p>
          }
        })}
      </div>

      <form onSubmit={handleCreateNewComment} className={styles.commentForm}>
        <strong>Deixe seu feedback</strong>

        <textarea 
          name='commentText'
          placeholder='Deixe um comentário'
          value={newCommentText}
          onChange={handleNewCommentChange}
          onInvalid={handleInvalidComment}
          required>
        </textarea>

        <footer>
          <button 
            type='submit' 
            disabled={isNewCommentEmpty}>
              Publicar
            </button>
        </footer>
      </form>
    
      <div className={styles.commentList}>
        {comments.map(comment => {
          return (
            <Comment 
              key={comment} 
              content={comment} 
              onDeleteComment={deleteComment}
              commentTime={new Date}
            />
          )
        })}
      </div>
    </article>
  )
}