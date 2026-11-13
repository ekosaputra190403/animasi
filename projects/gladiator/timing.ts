// Waktu dari rekaman vo/vo_narator.mp3 (61,1 s), ditranskrip faster-whisper; kata per kata di vo/kata.json.
export const FPS = 30;
export const DURASI = 64.6; // 61 s narasi + penutup tanpa narasi (miniatur Colosseum di meja → loop)
// [mulai, selesai] tiap shot dalam detik (storyboard.md v2, 20 shot)
export const SHOT: [number, number][] = [[0.0, 3.02], [3.02, 7.32], [7.32, 9.68], [9.68, 13.06], [13.06, 17.5], [17.5, 20.2], [20.2, 22.62], [22.62, 23.84], [23.84, 25.66], [25.66, 27.88], [27.88, 30.9], [30.9, 36.24], [36.24, 39.34], [39.34, 42.68], [42.68, 45.88], [45.88, 49.14], [49.14, 55.48], [55.48, 61.0], [61.0, 62.6], [62.6, 64.6]];
