import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';

import { RootState } from '../store/store';
import { fetchTrendingBooks } from '../api/booksApi';
import { setTrending } from '../store/bookSlice';
import BookCard from '../components/BookCard';
import Layout from './_Layout';
import { globalStyles } from '../styles/globalStyles';

const HomeScreen: React.FC = () => {
  const dispatch = useDispatch();
  const trendingBooks = useSelector((state: RootState) => state.books.trending);

  const themeMode = useSelector((state: RootState) => state.theme.theme);
  const themeColors = {
    light: { background: '#fff', text: '#000', subText: '#888', sectionBg: '#f9f9f9' },
    dark: { background: '#1c1c1c', text: '#fff', subText: '#aaa', sectionBg: '#333' },
  }[themeMode];

  const [refreshing, setRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [loading, setLoading] = useState(false);

  // Monitor network connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? false);
    });
    return () => unsubscribe();
  }, []);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const books = await fetchTrendingBooks(); // API call
      dispatch(setTrending(books));
    } catch (error) {
      console.error('Error fetching books', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBooks();
    setRefreshing(false);
  };

  useEffect(() => {
    loadBooks();
  }, []);

  return (
    <Layout>
      <View style={{ padding: 20, backgroundColor: themeColors.background, flex: 1 }}>
        {!isOnline && (
          <Text style={{ color: 'red', marginBottom: 10 }}>You are offline</Text>
        )}

        <Text style={[globalStyles.title , { color: themeColors.text }]}>Trending Books</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
        ) : (
          <ScrollView
            contentContainerStyle={{ paddingVertical: 10 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {trendingBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </ScrollView>
        )}
      </View>
    </Layout>
  );
};

export default HomeScreen;