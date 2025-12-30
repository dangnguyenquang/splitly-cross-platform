import MaterialIcons from '@react-native-vector-icons/material-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { SectionList, StyleSheet, ActivityIndicator, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../components/header/index';
import SectionDivider from '../../components/history/SectionDivider';
import NotificationItem from '../../components/notifications/NotificationCard';
import { colors } from '../../constant/theme';
import { getAllNotifications } from '@/src/api/notifee.api';
import { NotificationData } from '../../types/notification';

interface SectionData {
  title: string;
  data: NotificationData[];
}

const groupNotificationsByDate = (notifications: NotificationData[]): SectionData[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const dayBeforeYesterday = new Date(today);
  dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);

  const todayNotifications: NotificationData[] = [];
  const yesterdayNotifications: NotificationData[] = [];
  const dayBeforeYesterdayNotifications: NotificationData[] = [];
  const olderNotifications: NotificationData[] = [];

  notifications.forEach(notification => {
    const notificationDate = new Date(notification.createdAt);
    notificationDate.setHours(0, 0, 0, 0);

    if (notificationDate.getTime() === today.getTime()) {
      todayNotifications.push(notification);
    } else if (notificationDate.getTime() === yesterday.getTime()) {
      yesterdayNotifications.push(notification);
    } else if (notificationDate.getTime() === dayBeforeYesterday.getTime()) {
      dayBeforeYesterdayNotifications.push(notification);
    } else {
      olderNotifications.push(notification);
    }
  });

  const sections: SectionData[] = [];
  
  if (todayNotifications.length > 0) {
    sections.push({ title: 'Today', data: todayNotifications });
  }
  if (yesterdayNotifications.length > 0) {
    sections.push({ title: 'Yesterday', data: yesterdayNotifications });
  }
  if (dayBeforeYesterdayNotifications.length > 0) {
    sections.push({ title: 'A day before yesterday', data: dayBeforeYesterdayNotifications });
  }
  if (olderNotifications.length > 0) {
    sections.push({ title: 'Older', data: olderNotifications });
  }

  return sections;
};

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

export default function NotificationScreen() {
  const navigation = useNavigation();
  const [sections, setSections] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllNotifications();
      
      if (response.data) {
        const groupedData = groupNotificationsByDate(response.data);
        setSections(groupedData);
      } else {
        setError('Failed to load notifications');
      }
    } catch (err) {
      setError('An error occurred while loading notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <CustomHeader
          title="Notification"
          onLeftPress={() => navigation.goBack()}
          onRightPress={() => console.log('Settings pressed')}
          backgroundColor={colors.background}
          titleColor="#050404ff"
          shadow={true}
          leftIcon={{
            type: "icon",
            component: MaterialIcons,
            name: 'arrow-back',
            size: 28,
            color: '#000000ff',
          }}
          rightIcon={{
            type: "icon",
            component: MaterialIcons,
            name: 'settings',
            size: 26,
            color: '#000000ff',
          }}
        />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <CustomHeader
          title="Notification"
          onLeftPress={() => navigation.goBack()}
          onRightPress={() => console.log('Settings pressed')}
          backgroundColor={colors.background}
          titleColor="#050404ff"
          shadow={true}
          leftIcon={{
            type: "icon",
            component: MaterialIcons,
            name: 'arrow-back',
            size: 28,
            color: '#000000ff',
          }}
          rightIcon={{
            type: "icon",
            component: MaterialIcons,
            name: 'settings',
            size: 26,
            color: '#000000ff',
          }}
        />
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title="Notification"
        onLeftPress={() => navigation.goBack()}
        onRightPress={() => console.log('Settings pressed')}
        backgroundColor={colors.background}
        titleColor="#050404ff"
        shadow={true}
        leftIcon={{
          type: "icon",
          component: MaterialIcons,
          name: 'arrow-back',
          size: 28,
          color: '#000000ff',
        }}
        rightIcon={{
          type: "icon",
          component: MaterialIcons,
          name: 'settings',
          size: 26,
          color: '#000000ff',
        }}
      />
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.eventId.toString()}
        renderItem={({ item, index }) => (
          <NotificationItem
            title={item.title}
            description={item.body}
            time={formatTime(item.createdAt)}
            index={index}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <SectionDivider title={title} />
        )}
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>No notifications</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#ff0000',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});