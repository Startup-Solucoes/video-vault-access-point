
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Video, TrendingUp, Star, ArrowRight } from 'lucide-react';

interface StatsCardsProps {
  totalVideos: number;
  categories: number;
  onNavigateToVideos: () => void;
  onNavigateToServices: () => void;
}

export const StatsCards = ({ totalVideos, categories, onNavigateToVideos, onNavigateToServices }: StatsCardsProps) => {
  return null; // Cards removidos conforme solicitado
};
