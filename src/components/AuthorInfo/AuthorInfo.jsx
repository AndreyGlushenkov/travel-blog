export default function AuthorInfo({ author }) {
  if (!author || ![author.full_name, author.city, author.bio].some(Boolean)) return null;
  return <aside className="author-info" aria-label="Об авторе путешествия">
    {author.full_name && <h2 className="author-info__name">{author.full_name}</h2>}
    {author.city && <p className="author-info__city">{author.city}</p>}
    {author.bio && <p className="author-info__bio">{author.bio}</p>}
  </aside>;
}
