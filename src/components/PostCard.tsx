import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Post } from '../types/Post';
import colors from '../theme/colors';

type Props = {
  post: Post;
  onPress: () => void;
};

const AVATAR_BASE = 'https://i.pravatar.cc/80?u=';

export default function PostCard({ post, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.95} onPress={onPress}>
      <View style={styles.userRow}>
        <Image source={{ uri: `${AVATAR_BASE}${post.user_id}` }} style={styles.avatar} />
        <View style={styles.userText}>
          <Text style={styles.userName}>User {post.user_id}</Text>
          <Text style={styles.userId}>@user_{post.user_id}</Text>
        </View>
        <View style={styles.pill}>
          <Text style={styles.pillText}>Post</Text>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>{post.title}</Text>
      <Text style={styles.preview} numberOfLines={3}>{post.body}</Text>

      <View style={styles.footer}>
        <Text style={styles.readMore}>Read more →</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    marginBottom: 14,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: colors.avatarBorder,
  },
  userText: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  userId: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  pill: {
    backgroundColor: colors.accentMuted,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  pillText: {
    fontSize: 11,
    color: colors.accent,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 23,
    marginBottom: 8,
  },
  preview: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 21,
  },
  footer: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: 12,
  },
  readMore: {
    fontSize: 13,
    color: colors.accent,
    fontWeight: '600',
  },
});