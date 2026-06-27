import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  RefreshControl,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Post } from '../types/Post';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const AVATAR_BASE = 'https://i.pravatar.cc/80?u=';

export default function HomeScreen({ navigation }: Props) {
  const [posts, setPosts] = useState<Post[]>([]); //empty initially
  const [loading, setLoading] = useState(true); //initially done
  const [refreshing, setRefreshing] = useState(false); //on demand

  const fetchPosts = async () => {
    try {
      const res = await fetch('https://gorest.co.in/public/v2/posts?per_page=20');
      const data: Post[] = await res.json(); //waiting to fetch the data 
      setPosts(data); //fil it with the data we fetched
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []); 

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts();
  }, []);

  const renderPost = ({ item }: { item: Post }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('PostDetails', { postId: item.id })}
    >
      <View style={styles.cardAccent} />
      <View style={styles.cardBody}>
        <View style={styles.userRow}>
          <Image
            source={{ uri: `${AVATAR_BASE}${item.user_id}` }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.userName}>User {item.user_id}</Text>
            <Text style={styles.userId}>@user_{item.user_id}</Text>
          </View>
        </View>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.body} numberOfLines={3}>{item.body}</Text>
        <Text style={styles.readMore}>Tap to read more</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#F4A800" />
        <Text style={styles.loadingText}>Loading posts...</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={posts}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderPost}
      ListHeaderComponent={<Text style={styles.header}>What's happening</Text>}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F4A800" />
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A2342',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    fontSize: 26,
    fontWeight: '800',
    color: '#F4A800',
    marginBottom: 20,
    marginTop: 8,
  },
  card: {
    backgroundColor: '#0E3460',
    borderRadius: 14,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardAccent: {
    height: 4,
    backgroundColor: '#FF6B35',
  },
  cardBody: {
    padding: 16,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: '#F4A800',
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userId: {
    fontSize: 12,
    color: '#7FBBDE',
    marginTop: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F4A800',
    lineHeight: 22,
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    color: '#B8D4E8',
    lineHeight: 21,
  },
  readMore: {
    marginTop: 14,
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '600',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A2342',
  },
  loadingText: {
    color: '#7FBBDE',
    fontSize: 14,
    marginTop: 10,
  },
});
