import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useColorScheme } from 'react-native';
import { Mic, Library, Timer } from 'lucide-react-native';
import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Akort</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={<Mic size={20} color={colors.text} />}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Label>Makamlar</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={<Library size={20} color={colors.text} />}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="metronome">
        <NativeTabs.Trigger.Label>Metronom</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={<Timer size={20} color={colors.text} />}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
