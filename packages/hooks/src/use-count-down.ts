import { computed, onScopeDispose, ref } from 'vue';
import { useRafFn } from '@vueuse/core';

/**
 * A hook for implementing a countdown timer. It uses `requestAnimationFrame` for smooth and accurate timing,
 * independent of the screen refresh rate.
 *
 * @param initialSeconds - The total number of seconds for the countdown.
 */
export default function useCountDown(initialSeconds: number) {
  const remainingSeconds = ref(0);

  const count = computed(() => Math.ceil(remainingSeconds.value));

  const isCounting = computed(() => remainingSeconds.value > 0);

  const { pause, resume } = useRafFn(
    ({ delta }) => {
      // delta: milliseconds elapsed since the last frame.

      // If countdown already reached zero or below, ensure it's 0 and stop.
      if (remainingSeconds.value <= 0) {
        remainingSeconds.value = 0;
        pause();
        return;
      }

      // Calculate seconds passed since the last frame.
      const secondsPassed = delta / 1000;
      remainingSeconds.value -= secondsPassed;

      // If countdown has finished after decrementing.
      if (remainingSeconds.value <= 0) {
        remainingSeconds.value = 0;
        pause();
      }
    },
    { immediate: false } // The timer does not start automatically.
  );

  /**
   * Starts the countdown.
   *
   * @param [updatedSeconds=initialSeconds] - Optionally, start with a new duration. Default is `initialSeconds`
   */
  function start(updatedSeconds: number = initialSeconds) {
    remainingSeconds.value = updatedSeconds;
    resume();
  }

  /** Stops the countdown and resets the remaining time to 0. */
  function stop() {
    remainingSeconds.value = 0;
    pause();
  }

  // Ensure the rAF loop is cleaned up when the component is unmounted.
  onScopeDispose(() => {
    pause();
  });

  return {
    count,
    isCounting,
    start,
    stop
  };
}
