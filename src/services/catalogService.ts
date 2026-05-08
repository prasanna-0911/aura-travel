import { activities as localActivities, hotels as localHotels, restaurants as localRestaurants, Activity, Hotel, Restaurant } from '@/data';
import { apiRequest } from './apiClient';

interface ActivityListResponse {
  success: boolean;
  activities: Activity[];
  total: number;
}

interface HotelListResponse {
  success: boolean;
  hotels: Hotel[];
  total: number;
}

interface RestaurantListResponse {
  success: boolean;
  restaurants: Restaurant[];
  total: number;
}

function queryString(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') search.set(key, String(value));
  });
  const serialized = search.toString();
  return serialized ? `?${serialized}` : '';
}

export async function getActivities(params: Record<string, string | number | undefined> = {}): Promise<Activity[]> {
  try {
    const response = await apiRequest<ActivityListResponse>(`/activities${queryString(params)}`);
    return response.activities;
  } catch (error) {
    console.warn('Using local activities fallback:', error);
    return localActivities;
  }
}

export async function getHotels(params: Record<string, string | number | undefined> = {}): Promise<Hotel[]> {
  try {
    const response = await apiRequest<HotelListResponse>(`/hotels${queryString(params)}`);
    return response.hotels;
  } catch (error) {
    console.warn('Using local hotels fallback:', error);
    return localHotels;
  }
}

export async function getRestaurants(params: Record<string, string | number | undefined> = {}): Promise<Restaurant[]> {
  try {
    const response = await apiRequest<RestaurantListResponse>(`/restaurants${queryString(params)}`);
    return response.restaurants;
  } catch (error) {
    console.warn('Using local restaurants fallback:', error);
    return localRestaurants;
  }
}

export async function getAdminActivities(): Promise<Activity[]> {
  const response = await apiRequest<ActivityListResponse>('/admin/activities');
  return response.activities;
}

export async function createAdminActivity(activity: Partial<Activity>): Promise<Activity> {
  const response = await apiRequest<{ success: boolean; activity: Activity }>('/admin/activities', {
    method: 'POST',
    body: JSON.stringify(activity)
  });
  return response.activity;
}

export async function updateAdminActivity(id: string, activity: Partial<Activity>): Promise<Activity> {
  const response = await apiRequest<{ success: boolean; activity: Activity }>(`/admin/activities/${id}`, {
    method: 'PUT',
    body: JSON.stringify(activity)
  });
  return response.activity;
}

export async function deleteAdminActivity(id: string): Promise<void> {
  await apiRequest<{ success: boolean }>(`/admin/activities/${id}`, {
    method: 'DELETE'
  });
}

export interface AdminAnalytics {
  total_users: number;
  total_trips: number;
  total_bookings: number;
  total_activities: number;
  total_hotels: number;
  total_restaurants: number;
  total_entities: number;
  popular_destinations: { _id: string; count: number }[];
  tag_usage_stats: { _id: string; count: number }[];
}

export async function getAdminAnalytics(): Promise<AdminAnalytics> {
  return apiRequest<AdminAnalytics & { success: boolean }>('/admin/analytics');
}
