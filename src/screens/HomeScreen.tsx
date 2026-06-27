import React, { useEffect, useState, useCallback } from 'react';
import colors from '../theme/colors';
import { getPosts } from '../services/api'; 
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
    const data: Post[] = await getPosts();
    setPosts(data);
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
        <ActivityIndicator size="large" color={colors.accent} />
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
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textAccent,
    marginBottom: 20,
    marginTop: 8,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardAccent: {
    height: 4,
    backgroundColor: colors.accent,
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
    borderColor: colors.avatarBorder,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  userId: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textAccent,
    lineHeight: 22,
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 21,
  },
  readMore: {
    marginTop: 14,
    fontSize: 12,
    color: colors.accent,
    fontWeight: '600',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 10,
  },
});