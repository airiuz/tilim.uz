export const AudioWorklet = (url: URL) => {
  return url as unknown as string;
};

export async function delay(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
