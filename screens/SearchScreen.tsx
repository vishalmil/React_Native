// screens/SearchScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import BookCard from '../components/BookCard';
import Layout from './_Layout';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchResults } from '../store/bookSlice';
import { RootState } from '../store/store';
import { colors } from '../theme/colors';
import { searchBooks } from '../api/booksApi';
import { styles } from '../styles/styles';

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
      <ScrollView contentContainerStyle={[styles.search_container, { backgroundColor: theme.background }]}>
        <Text style={[styles.search_title, { color: theme.text }]}>Search Books</Text>

        <View style={styles.search_searchRow}>
          <TextInput
            style={[styles.search_input, { borderColor: theme.border, color: theme.text }]}
            placeholder="Search by title or author"
            placeholderTextColor={theme.placeholder}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={[styles.search_button, { backgroundColor: theme.buttonBackground }]} onPress={handleSearch}>
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