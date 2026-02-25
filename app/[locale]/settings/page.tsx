'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings, Globe, Palette, DollarSign, Bell, Shield } from 'lucide-react';

export default function SettingsPage() {
  const t = useTranslations('settings');
  const locale = useLocale();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground mt-1">{t('description')}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Language */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {t('language')}
            </CardTitle>
            <CardDescription>{t('languageDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button variant={locale === 'ar' ? 'default' : 'outline'} className="flex-1">
                العربية
              </Button>
              <Button variant={locale === 'en' ? 'default' : 'outline'} className="flex-1">
                English
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Theme */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              {t('theme')}
            </CardTitle>
            <CardDescription>{t('themeDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1">{t('light')}</Button>
              <Button variant="outline" className="flex-1">{t('dark')}</Button>
              <Button variant="default" className="flex-1">{t('system')}</Button>
            </div>
          </CardContent>
        </Card>

        {/* Currency */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              {t('currency')}
            </CardTitle>
            <CardDescription>{t('currencyDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button variant="default" className="flex-1">AED</Button>
              <Button variant="outline" className="flex-1">USD</Button>
              <Button variant="outline" className="flex-1">EUR</Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              {t('notifications')}
            </CardTitle>
            <CardDescription>{t('notificationsDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">{t('paymentDue')}</span>
              <Button variant="outline" size="sm">{t('enabled')}</Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{t('subscriptionRenewal')}</span>
              <Button variant="outline" size="sm">{t('enabled')}</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <Button size="lg">{t('save')}</Button>
      </div>
    </div>
  );
}
