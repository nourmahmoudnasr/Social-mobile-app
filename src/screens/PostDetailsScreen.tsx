import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Comment } from '../types/Comment';
import usePosts from '../hooks/usePosts';
import colors from '../theme/colors';
import CommentCard from '../components/CommentCard';

type Props = {
  route: RouteProp<RootStackParamList, 'PostDetails'>;
};

const AVATAR_BASE = 'https://i.pravatar.cc/80?u=';

export default function PostDetailsScreen({ route }: Props) {
  const { postId } = route.params;
  const { post, comments, loadingPost, loadingComments } = usePosts(postId);

  const ListHeader = () => {
    if (loadingPost) return <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 40 }} />;
    if (!post) return null;

    return (
      <View>
        {/* Post Card */}
        <View style={styles.postCard}>
          <View style={styles.userRow}>
            <Image source={{ uri: `${AVATAR_BASE}${post.user_id}` }} style={styles.avatar} />
            <View style={styles.userText}>
              <Text style={styles.userName}>User {post.user_id}</Text>
              <Text style={styles.userId}>@user_{post.user_id}</Text>
            </View>
          </View>
          <Text style={styles.postTitle}>{post.title}</Text>
          <View style={styles.divider} />
          <Text style={styles.postBody}>{post.body}</Text>
        </View>

        {/* Comments Header */}
        <View style={styles.commentsHeader}>
          <Text style={styles.commentsTitle}>Comments</Text>
          {!loadingComments && (
            <View style={styles.commentBadge}>
              <Text style={styles.commentBadgeText}>{comments.length}</Text>
            </View>
          )}
        </View>

        {loadingComments && (
          <ActivityIndicator size="small" color={colors.accent} style={{ marginVertical: 20 }} />
        )}
        {!loadingComments && comments.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No comments yet</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={loadingComments ? [] : comments}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }: { item: Comment }) => <CommentCard comment={item} />}
      ListHeaderComponent={ListHeader}
      showsVerticalScrollIndicator={false}
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
  postCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: colors.avatarBorder,
  },
  userText: {
    marginLeft: 12,
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
  postTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 28,
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginBottom: 14,
  },
  postBody: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  commentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  commentBadge: {
    backgroundColor: colors.accentMuted,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  commentBadgeText: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '700',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
});