import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Comment } from '../types/Comment';
import colors from '../theme/colors';

type Props = {
  comment: Comment;
};

const AVATAR_BASE = 'https://i.pravatar.cc/80?u=';

export default function CommentCard({ comment }: Props) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: `${AVATAR_BASE}${comment.email}` }} style={styles.avatar} />
      <View style={styles.bubble}>
        <View style={styles.header}>
          <Text style={styles.name}>{comment.name}</Text>
          <Text style={styles.email}>{comment.email}</Text>
        </View>
        <Text style={styles.body}>{comment.body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: colors.avatarBorder,
    marginTop: 2,
  },
  bubble: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 16,
    borderTopLeftRadius: 4,
    padding: 14,
  },
  header: {
    marginBottom: 8,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  email: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  body: {
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 20,
  },
});