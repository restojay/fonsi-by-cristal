/**
 * About screen — mirrors the website's About page
 * Certifications, values, specializations, story, and contact info
 */

import React from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  Linking,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Header } from '@components/Header';
import { AnimatedSection } from '@components/AnimatedSection';
import { GradientButton } from '@components/GradientButton';
import { GradientCard } from '@components/GradientCard';
import { SectionLabel } from '@components/SectionLabel';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '@constants/theme';

const certifications = [
  'MAC Pro Certified',
  'OLAPLEX Certified',
  'Wella Professional',
  'MOROCCANOIL Certified',
  'Licensed Cosmetologist, 10+ yrs',
];

const values = [
  {
    title: 'Client Care',
    desc: 'Every client is treated like family. I listen to your needs and work with you to create the look that makes you feel your best.',
  },
  {
    title: 'Excellence',
    desc: 'I use only premium products and the latest techniques. Continuous learning ensures you receive the highest quality service.',
  },
  {
    title: 'Artistry',
    desc: 'Beauty is an art form. I bring creativity, skill, and passion to every service, creating results that inspire confidence.',
  },
];

const specializations: { title: string; icon: keyof typeof Feather.glyphMap; items: string[] }[] = [
  {
    title: 'Color & Correction',
    icon: 'droplet',
    items: ['Full color transformations', 'Balayage & highlights', 'Color correction', 'Toning & gloss treatments'],
  },
  {
    title: 'Cuts & Styling',
    icon: 'scissors',
    items: ['Precision cuts', 'Blowouts & styling', 'Special occasion updos', 'Keratin & smoothing treatments'],
  },
  {
    title: 'Bridal',
    icon: 'heart',
    items: ['Bride hair & makeup', 'Wedding party styling', 'Trials & consultations', 'On-site services available'],
  },
  {
    title: 'Makeup & Beauty',
    icon: 'star',
    items: ['Professional MAC application', 'Editorial & glam looks', 'Lash & brow services', 'Waxing treatments'],
  },
];

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Header title="Meet Cristal" subtitle="THE ARTIST" showLogo={false} />

      {/* Photo */}
      <AnimatedSection delay={50} style={styles.photoSection}>
        <View style={styles.photoContainer}>
          <Image
            source={require('../../assets/headshot.jpg')}
            style={styles.photo}
            resizeMode="cover"
          />
        </View>
      </AnimatedSection>

      {/* Story */}
      <AnimatedSection delay={100} style={styles.section}>
        <SectionLabel text="THE STORY" />
        <Text style={styles.sectionTitle}>A Decade of Artistry</Text>
        <Text style={styles.bodyText}>
          With over a decade of experience as a licensed cosmetologist, Cristal has
          built Fonsi into one of San Antonio's trusted destinations for professional
          beauty services. Working across salon and studio settings for diverse occasions
          including bridal events, pageants, and runway work, she brings depth and
          versatility to every appointment.
        </Text>
        <Text style={styles.bodyText}>
          What started as a passion for making people feel confident has grown into a
          thriving studio beloved by the San Antonio community. Every client receives
          personalized attention and care, from the initial consultation to the final look.
        </Text>
      </AnimatedSection>

      {/* Quote */}
      <AnimatedSection delay={200} style={styles.section}>
        <View style={styles.quoteCard}>
          <Text style={styles.quoteOpen}>{'\u201C'}</Text>
          <Text style={styles.quoteText}>
            You know you've gotten a really superb service when strangers stop
            you and ask who your stylist is.
          </Text>
          <View style={styles.quoteLine} />
        </View>
      </AnimatedSection>

      {/* Certifications */}
      <AnimatedSection delay={300} style={styles.section}>
        <SectionLabel text="CREDENTIALS" />
        <Text style={styles.sectionTitle}>Certifications</Text>
        <View style={styles.certGrid}>
          {certifications.map((cert) => (
            <View key={cert} style={styles.certPill}>
              <Text style={styles.certText}>{cert}</Text>
            </View>
          ))}
        </View>
      </AnimatedSection>

      {/* Values */}
      <AnimatedSection delay={400} style={styles.section}>
        <SectionLabel text="PHILOSOPHY" />
        <Text style={styles.sectionTitle}>My Approach</Text>
        {values.map((value, i) => (
          <View key={value.title} style={styles.valueCard}>
            <Text style={styles.valueNumber}>0{i + 1}</Text>
            <Text style={styles.valueTitle}>{value.title}</Text>
            <Text style={styles.valueDesc}>{value.desc}</Text>
          </View>
        ))}
      </AnimatedSection>

      {/* Specializations */}
      <AnimatedSection delay={500} style={styles.section}>
        <SectionLabel text="WHAT I DO" />
        <Text style={styles.sectionTitle}>Specializations</Text>
        <View style={styles.specGrid}>
          {specializations.map((spec) => (
            <View key={spec.title} style={styles.specCard}>
              <View style={styles.specIconCircle}>
                <Feather name={spec.icon} size={16} color="#ffffff" />
              </View>
              <Text style={styles.specTitle}>{spec.title}</Text>
              {spec.items.map((item) => (
                <View key={item} style={styles.specItem}>
                  <View style={styles.specDot} />
                  <Text style={styles.specItemText}>{item}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </AnimatedSection>

      {/* Contact Info */}
      <AnimatedSection delay={600} style={styles.section}>
        <SectionLabel text="GET IN TOUCH" />
        <GradientCard>
          <View style={styles.contactRow}>
            <View style={styles.contactIconCircle}>
              <Feather name="map-pin" size={14} color="#ffffff" />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactLabel}>Location</Text>
              <Text style={styles.contactValue}>6626 West Loop 1604 North, Suite 105</Text>
              <Text style={styles.contactDetail}>San Antonio, TX 78254 (Suites 39 & 41)</Text>
            </View>
          </View>
          <View style={styles.contactDivider} />
          <View style={styles.contactRow}>
            <View style={styles.contactIconCircle}>
              <Feather name="phone" size={14} color="#ffffff" />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactLabel}>Phone</Text>
              <Text
                style={[styles.contactValue, styles.contactLink]}
                onPress={() => Linking.openURL('tel:2105517742')}
              >
                (210) 551-7742
              </Text>
            </View>
          </View>
          <View style={styles.contactDivider} />
          <View style={styles.contactRow}>
            <View style={styles.contactIconCircle}>
              <Feather name="clock" size={14} color="#ffffff" />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactLabel}>Hours</Text>
              <Text style={styles.contactValue}>Tue - Sat: 10 AM - 6:30 PM</Text>
              <Text style={styles.contactDetail}>Sun & Mon: Closed</Text>
            </View>
          </View>
          <View style={styles.contactDivider} />
          <View style={styles.contactRow}>
            <View style={styles.contactIconCircle}>
              <Feather name="instagram" size={14} color="#ffffff" />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactLabel}>Instagram</Text>
              <Text
                style={[styles.contactValue, styles.contactLink]}
                onPress={() => Linking.openURL('https://www.instagram.com/fonsi_by_cristal/')}
              >
                @fonsi_by_cristal
              </Text>
            </View>
          </View>
        </GradientCard>
      </AnimatedSection>

      {/* Book CTA */}
      <AnimatedSection delay={700} style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>Ready to book?</Text>
        <Text style={styles.ctaSubtext}>By appointment only. Tue - Sat, 10 AM - 6:30 PM.</Text>
        <GradientButton
          title="Book Appointment"
          onPress={() => router.push('/book')}
          icon="calendar"
          iconRight="arrow-right"
        />
      </AnimatedSection>

      <View style={{ height: SPACING['2xl'] }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  } as ViewStyle,
  photoSection: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  } as ViewStyle,
  photoContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: COLORS.borderColor,
  } as ViewStyle,
  photo: {
    width: '100%',
    height: '100%',
  } as ImageStyle,
  section: {
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING['3xl'],
  } as ViewStyle,
  sectionTitle: {
    fontSize: FONTS['2xl'],
    fontFamily: FONTS.serifBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  } as TextStyle,
  bodyText: {
    fontSize: FONTS.sm,
    fontFamily: FONTS.sansSerif,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: SPACING.md,
  } as TextStyle,

  // Quote
  quoteCard: {
    borderLeftWidth: 2,
    borderLeftColor: COLORS.borderColor,
    paddingLeft: SPACING.lg,
    paddingVertical: SPACING.sm,
  } as ViewStyle,
  quoteOpen: {
    fontSize: 48,
    fontFamily: FONTS.serif,
    color: COLORS.textPrimary,
    lineHeight: 48,
    marginBottom: -SPACING.sm,
  } as TextStyle,
  quoteText: {
    fontSize: FONTS.lg,
    fontFamily: FONTS.serif,
    fontStyle: 'italic',
    color: COLORS.textPrimary,
    lineHeight: 28,
  } as TextStyle,
  quoteLine: {
    width: 40,
    height: 1,
    backgroundColor: COLORS.borderColor,
    marginTop: SPACING.lg,
  } as ViewStyle,

  // Certifications
  certGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  } as ViewStyle,
  certPill: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    backgroundColor: COLORS.bgSecondary,
  } as ViewStyle,
  certText: {
    fontSize: FONTS.xs,
    fontFamily: FONTS.sansSerifMedium,
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
  } as TextStyle,

  // Values
  valueCard: {
    borderRadius: BORDER_RADIUS['2xl'],
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    padding: SPACING.xl,
    marginBottom: SPACING.md,
  } as ViewStyle,
  valueNumber: {
    fontSize: FONTS['3xl'],
    fontFamily: FONTS.serif,
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
  } as TextStyle,
  valueTitle: {
    fontSize: FONTS.lg,
    fontFamily: FONTS.serifBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  } as TextStyle,
  valueDesc: {
    fontSize: FONTS.sm,
    fontFamily: FONTS.sansSerif,
    color: COLORS.textSecondary,
    lineHeight: 22,
  } as TextStyle,

  // Specializations
  specGrid: {
    gap: SPACING.md,
  } as ViewStyle,
  specCard: {
    borderRadius: BORDER_RADIUS['2xl'],
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    padding: SPACING.xl,
  } as ViewStyle,
  specIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#171717',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  } as ViewStyle,
  specTitle: {
    fontSize: FONTS.base,
    fontFamily: FONTS.serifBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  } as TextStyle,
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  } as ViewStyle,
  specDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.textMuted,
    marginRight: SPACING.md,
  } as ViewStyle,
  specItemText: {
    fontSize: FONTS.sm,
    fontFamily: FONTS.sansSerif,
    color: COLORS.textSecondary,
  } as TextStyle,

  // Contact
  contactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  } as ViewStyle,
  contactIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#171717',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    marginTop: 2,
  } as ViewStyle,
  contactContent: {
    flex: 1,
  } as ViewStyle,
  contactLabel: {
    fontSize: FONTS.xs,
    fontFamily: FONTS.sansSerifSemiBold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  } as TextStyle,
  contactValue: {
    fontSize: FONTS.sm,
    fontFamily: FONTS.sansSerif,
    color: COLORS.textSecondary,
    lineHeight: 20,
  } as TextStyle,
  contactDetail: {
    fontSize: FONTS.xs,
    fontFamily: FONTS.sansSerif,
    color: COLORS.textMuted,
    marginTop: 2,
  } as TextStyle,
  contactLink: {
    color: COLORS.textPrimary,
    textDecorationLine: 'underline',
  } as TextStyle,
  contactDivider: {
    height: 1,
    backgroundColor: COLORS.borderColor,
    marginVertical: SPACING.md,
  } as ViewStyle,

  // CTA
  ctaSection: {
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING['2xl'],
    alignItems: 'center',
  } as ViewStyle,
  ctaTitle: {
    fontSize: FONTS['2xl'],
    fontFamily: FONTS.serifBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  } as TextStyle,
  ctaSubtext: {
    fontSize: FONTS.sm,
    fontFamily: FONTS.sansSerif,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  } as TextStyle,
});
