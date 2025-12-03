import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { addFavorite, removeFavorite, Book } from '../store/bookSlice';
import { saveFavorites } from '../utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.books.favorites);

  const themeMode = useSelector((state: RootState) => state.theme.theme);
  const theme = colors[themeMode];

  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    setIsFav(favorites.some(f => f.id === book.id));
  }, [favorites, book.id]);

  const toggleFavorite = async () => {
    if (isFav) {
      dispatch(removeFavorite(book.id));
      setIsFav(false);
      const updated = favorites.filter(f => f.id !== book.id);
      await saveFavorites(updated);
    } else {
      dispatch(addFavorite(book));
      setIsFav(true);
      await saveFavorites([...favorites, book]);
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      {book.cover ? (
        <Image source={{ uri: book.cover }} style={styles.cover} />
      ) : (
        <View style={[styles.cover, styles.noCover, { backgroundColor: theme.border }]}>
          <Text style={{ color: theme.placeholder }}>No Image</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={[styles.title, { color: theme.text }]}>{book.title ?? ''}</Text>
        <Text style={[styles.author, { color: theme.placeholder }]}>{book.author ?? ''}</Text>
        {book.publishYear != null && (
          <Text style={[styles.year, { color: theme.placeholder }]}>{book.publishYear}</Text>
        )}
      </View>

      <TouchableOpacity onPress={toggleFavorite} style={styles.favButton}>
        <Ionicons name={isFav ? 'star' : 'star-outline'} size={28} color="#FFD700" />
      </TouchableOpacity>
    </View>
  );
};

export default BookCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  cover: { width: 60, height: 90, borderRadius: 4, marginRight: 10 },
  noCover: { justifyContent: 'center', alignItems: 'center' },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: 'bold' },
  author: { fontSize: 14 },
  year: { fontSize: 12 },
  favButton: { padding: 5 },
});