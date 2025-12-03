import axios from 'axios';

export const searchBooks = async (query: string) => {
  const res = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=20`);
  return res.data.docs.map((book: any) => ({
    id: book.key,
    title: book.title,
    author: book.author_name?.[0] || 'Unknown',
    cover: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : undefined,
    publishYear: book.first_publish_year,
    description: book.subtitle || '',
  }));
};

export const fetchTrendingBooks = async () => {
  const res = await axios.get('https://openlibrary.org/subjects/science_fiction.json?limit=20');
  return res.data.works.map((book: any) => ({
    id: book.key,
    title: book.title,
    author: book.authors?.[0]?.name || 'Unknown',
    cover: book.cover_id ? `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg` : undefined,
    publishYear: book.first_publish_year,
  }));
};
