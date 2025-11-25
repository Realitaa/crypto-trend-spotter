export default defineEventHandler(async () => {
    try {
      // Request ke status.coingecko.com
      const data = await $fetch(
        "https://status.coingecko.com/metrics?period=day&lang=en",
        { timeout: 3000 } // 3 detik timeout untuk menghindari long-wait
      );
  
      // Response structure:
      // {
      //   metrics: [
      //     {
      //       title: "CoinGecko Public API Response time",
      //       entries: [{ value: 200.123, time: 171234567 }]
      //     }
      //   ]
      // }
  
      if (!data?.metrics?.length) {
        throw new Error("Invalid metrics data");
      }
  
      const metric = data.metrics.find((m: any) =>
        m.title?.includes("CoinGecko Public API Response time")
      );
  
      if (!metric) {
        throw new Error("Metric not found");
      }
  
      const entries = metric.entries;
      const last = entries?.[entries.length - 1];
  
      return {
        ok: true,
        responseTime: last?.value ?? null,
        raw: last,
      };
    } catch {
      return {
        ok: false,
        error: "Unable to reach CoinGecko Statuspage",
      };
    }
  });
  