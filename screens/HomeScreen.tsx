import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  RefreshControl,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';

import { RootState } from '../store/store';
import { fetchTrendingBooks } from '../api/booksApi';
import { setTrending } from '../store/bookSlice';
import BookCard from '../components/BookCard';
import Layout from './_Layout';
import { styles } from '../styles/styles';
import { colors } from '../theme/colors';

const HomeScreen: React.FC = () => {
  const dispatch = useDispatch();
  const trendingBooks = useSelector((state: RootState) => state.books.trending);

  const themeMode = useSelector((state: RootState) => state.theme.theme);
  const themeColors = colors[themeMode]

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
      <View style={[styles.home_container, { backgroundColor: themeColors.background }]}>
        {!isOnline && (
          <Text style={styles.home_offlineText}>You are offline</Text>
        )}

        <Text style={[styles.home_title, { color: themeColors.text }]}>Trending Books</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={styles.home_loader} />
        ) : (
          // <ScrollView
          //   contentContainerStyle={styles.home_scrollContent}
          //   refreshControl={
          //     <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          //   }
          //>

          //   {trendingBooks.map((book) => (
          //     <BookCard key={book.id} book={book} />
          //   ))}
          // </ScrollView>

          <FlatList
            data={trendingBooks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <BookCard book={item} />}
            refreshing={refreshing}
            onRefresh={onRefresh}
            contentContainerStyle={styles.home_scrollContent}
          />
        )}
      </View>
    </Layout>
  );
};

export default HomeScreen;