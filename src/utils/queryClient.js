import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Hata durumunda yeniden deneme sayısı
      refetchOnWindowFocus: true, // Sayfa odağı değişince yeniden sorgu yapmasın
    },
  },
});

export default queryClient;
