import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  ActivityIndicator, Image,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Post } from '../types/Post';
import { Comment } from '../types/Comment';

type Props = {
  route: RouteProp<RootStackParamList, 'PostDetails'>;
};

const AVATAR_BASE = 'https://i.pravatar.cc/80?u=';

export default function PostDetailsScreen({ route }: Props) {
  const { postId } = route.params; //we need to know which post to fetch
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingPost, setLoadingPost] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);

  useEffect(() => {
    //fetch post and comments in parallel no await
    fetch(`https://gorest.co.in/public/v2/posts/${postId}`)
      .then((r) => r.json())
      .then((data: Post) => setPost(data))
      .catch(console.error)
      .finally(() => setLoadingPost(false));

    fetch(`https://gorest.co.in/public/v2/posts/${postId}/comments`)
      .then((r) => r.json())
      .then((data: Comment[]) => setComments(data))
      .catch(console.error)
      .finally(() => setLoadingComments(false));
  }, [postId]);

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentCard}>
      <Image source={{ uri: `${AVATAR_BASE}${item.email}` }} style={styles.commentAvatar} />
      <View style={styles.commentContent}>
        <Text style={styles.commentName}>{item.name}</Text>
        <Text style={styles.commentEmail}>{item.email}</Text>
        <Text style={styles.commentBody}>{item.body}</Text>
      </View>
    </View>
  );

  const ListHeader = () => {
    if (loadingPost) return <ActivityIndicator size="large" color="#F4A800" style={{ marginTop: 40 }} />;
    if (!post) return null;
    return (
      <View>
        <View style={styles.postCard}>
          <View style={styles.cardAccent} />
          <View style={styles.postCardBody}>
            <View style={styles.userRow}>
              <Image source={{ uri: `${AVATAR_BASE}${post.user_id}` }} style={styles.avatar} />
              <View>
                <Text style={styles.userName}>User {post.user_id}</Text>
                <Text style={styles.userId}>@user_{post.user_id}</Text>
              </View>
            </View>
            <Text style={styles.postTitle}>{post.title}</Text>
            <View style={styles.divider} />
            <Text style={styles.postBody}>{post.body}</Text>
          </View>
        </View>

        <View style={styles.commentsHeader}>
          <Text style={styles.commentsTitle}>Comments</Text>
          {!loadingComments && (
            <View style={styles.commentCount}>
              <Text style={styles.commentCountText}>{comments.length}</Text>
            </View>
          )}
        </View>

        {loadingComments && <ActivityIndicator size="small" color="#F4A800" style={{ marginVertical: 20 }} />}
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
      renderItem={renderComment}
      ListHeaderComponent={ListHeader}
      showsVerticalScrollIndicator={false}
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

  // Post card
  postCard: {
    backgroundColor: '#0E3460',
    borderRadius: 14,
    marginBottom: 24,
    overflow: 'hidden',
  },
  cardAccent: {
    height: 4,
    backgroundColor: '#FF6B35',
  },
  postCardBody: {
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
  postTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F4A800',
    lineHeight: 26,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#1A3F6F',
    marginBottom: 12,
  },
  postBody: {
    fontSize: 14,
    color: '#B8D4E8',
    lineHeight: 21,
  },

  // Comments section
  commentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F4A800',
  },
  commentCount: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentCountText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '700',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 15,
    color: '#7FBBDE',
  },

  // Comment card
  commentCard: {
    flexDirection: 'row',
    backgroundColor: '#0E3460',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    overflow: 'hidden',
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#F4A800',
  },
  commentContent: {
    flex: 1,
    marginLeft: 12,
  },
  commentName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  commentEmail: {
    fontSize: 11,
    color: '#7FBBDE',
    marginTop: 1,
    marginBottom: 6,
  },
  commentBody: {
    fontSize: 14,
    color: '#B8D4E8',
    lineHeight: 21,
  },
});
