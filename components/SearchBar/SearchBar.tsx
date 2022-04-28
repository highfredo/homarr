import { Input, TextInput, Text, ActionIcon, useMantineTheme, Center } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { useState, useEffect } from 'react';
import { Search, ArrowRight, ArrowLeft, BrandYoutube, Download } from 'tabler-icons-react';
import { Config, loadConfig } from '../../tools/config';

export default function SearchBar(props: any) {
  const [icon, setIcon] = useState(<Search />);
  const theme = useMantineTheme();
  const [config, setConfig] = useState<Config>({
    searchBar: true,
    searchUrl: 'https://www.google.com/search?q=',
  });

  const querryUrl = config.searchUrl || 'https://www.google.com/search?q=';

  const form = useForm({
    initialValues: {
      querry: '',
    },
  });

  useEffect(() => {
    const config = loadConfig('settings');
    if (config) {
      showNotification({
        autoClose: 1000,
        title: <Text>Config loaded</Text>,
        message: undefined,
      });
      setConfig(config);
    }
  }, []);

  if (!config.searchBar) {
    return null;
  }

  return (
    <form
      onChange={() => {
        // If querry contains !yt or !t add "Searching on YouTube" or "Searching torrent"
        const querry = form.values.querry.trim();
        const isYoutube = querry.startsWith('!yt');
        const isTorrent = querry.startsWith('!t');
        if (isYoutube) {
          setIcon(<BrandYoutube />);
        } else if (isTorrent) {
          setIcon(<Download />);
        } else {
          setIcon(<Search />);
        }
      }}
      onSubmit={form.onSubmit((values) => {
        // Find if querry is prefixed by !yt or !t
        const querry = values.querry.trim();
        const isYoutube = querry.startsWith('!yt');
        const isTorrent = querry.startsWith('!t');
        if (isYoutube) {
          window.open(`https://www.youtube.com/results?search_query=${querry.substring(3)}`);
        } else if (isTorrent) {
          window.open(`https://thepiratebay.org/search.php?q=${querry.substring(3)}`);
        } else {
          window.open(`${querryUrl}${values.querry}`);
        }
      })}
    >
      <TextInput
        variant="filled"
        color="blue"
        icon={<Search size={18} />}
        radius="md"
        rightSection={icon}
        size="md"
        placeholder="Search the web"
        {...props}
        {...form.getInputProps('querry')}
      />
    </form>
  );
}