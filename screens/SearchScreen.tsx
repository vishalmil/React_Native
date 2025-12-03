// screens/SearchScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import BookCard from '../components/BookCard';
import Layout from './_Layout';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchResults, Book } from '../store/bookSlice';
import { RootState } from '../store/store';
import { colors } from '../theme/colors';
import { searchBooks } from '../api/booksApi';

const SearchScreen: React.FC = () => {
  const dispatch = useDispatch();
  const searchResults = useSelector((state: RootState) => state.books.searchResults);
  const themeMode = useSelector((state: RootState) => state.theme.theme);
  const theme = colors[themeMode];

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);

    try {
      const books = await searchBooks(query); // API call
      dispatch(setSearchResults(books));
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.title, { color: theme.text }]}>Search Books</Text>

        <View style={styles.searchRow}>
          <TextInput
            style={[styles.input, { borderColor: theme.border, color: theme.text }]}
            placeholder="Search by title or author"
            placeholderTextColor={theme.placeholder}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={[styles.button, { backgroundColor: theme.buttonBackground }]} onPress={handleSearch}>
            <Text style={{ color: theme.buttonText }}>Search</Text>
          </TouchableOpacity>
        </View>

        {loading && <ActivityIndicator size="large" color={theme.text} style={{ marginVertical: 20 }} />}

        <View style={{ marginTop: 20 }}>
          {searchResults.length === 0 && !loading && (
            <Text style={{ color: theme.text, textAlign: 'center' }}>No results found.</Text>
          )}
          {searchResults.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </View>
      </ScrollView>
    </Layout>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: { padding: 20, flexGrow: 1 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  searchRow: { flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderRadius: 8, padding: 10, marginRight: 10 },
  button: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, alignItems: 'center' },
});
