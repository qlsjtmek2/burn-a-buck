/**
 * ShareBottomSheet Component
 *
 * 공유 플랫폼 선택을 위한 Bottom Sheet UI
 */

import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { Portal, Modal } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { SharePlatform, SharePlatformOption } from '../../../types/share';

interface ShareBottomSheetProps {
  visible: boolean;
  onDismiss: () => void;
  onSelectPlatform: (platform: SharePlatform) => void;
}

const ShareBottomSheet: React.FC<ShareBottomSheetProps> = ({
  visible,
  onDismiss,
  onSelectPlatform,
}) => {
  const { t } = useTranslation();

  // 공유 플랫폼 옵션
  const platforms: SharePlatformOption[] = [
    {
      id: 'kakao',
      label: t('share.platform.kakao'),
      icon: 'chat',
      color: '#FEE500',
    },
    {
      id: 'instagram',
      label: t('share.platform.instagram'),
      icon: 'instagram',
      color: '#E4405F',
    },
    {
      id: 'facebook',
      label: t('share.platform.facebook'),
      icon: 'facebook',
      color: '#1877F2',
    },
    {
      id: 'twitter',
      label: t('share.platform.twitter'),
      icon: 'twitter',
      color: '#1DA1F2',
    },
    {
      id: 'sms',
      label: t('share.platform.sms'),
      icon: 'message-text',
      color: '#10B981',
    },
    {
      id: 'copy_link',
      label: t('share.platform.copyLink'),
      icon: 'link-variant',
      color: '#6B7280',
    },
    {
      id: 'more',
      label: t('share.platform.more'),
      icon: 'share-variant',
      color: colors.primary,
    },
  ];

  const handlePlatformPress = (platform: SharePlatform) => {
    onSelectPlatform(platform);
    onDismiss();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modal}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.handleBar} />
            <Text style={styles.title}>{t('share.title')}</Text>
          </View>

          {/* Platform Grid */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.gridContainer}
            showsVerticalScrollIndicator={false}
          >
            {platforms.map((platform) => (
              <Pressable
                key={platform.id}
                style={styles.platformItem}
                onPress={() => handlePlatformPress(platform.id)}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`${platform.label}로 공유`}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: `${platform.color}15` },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={platform.icon as any}
                    size={28}
                    color={platform.color}
                  />
                </View>
                <Text style={styles.platformLabel} numberOfLines={1}>
                  {platform.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Cancel Button */}
          <Pressable
            style={styles.cancelButton}
            onPress={onDismiss}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="취소"
          >
            <Text style={styles.cancelButtonText}>
              {t('common.cancel')}
            </Text>
          </Pressable>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 16, // Safe area for iOS
  },
  header: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginBottom: 12,
  },
  title: {
    ...typography.headlineSmall,
    color: colors.text,
    fontWeight: '600',
  },
  scrollView: {
    maxHeight: 400,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 16,
  },
  platformItem: {
    width: '22%', // 4 items per row with gap
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  platformLabel: {
    ...typography.labelSmall,
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 11,
  },
  cancelButton: {
    margin: 16,
    marginTop: 8,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...typography.labelLarge,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});

export default ShareBottomSheet;
