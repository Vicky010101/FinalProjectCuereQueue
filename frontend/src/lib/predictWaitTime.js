export function predictWaitTime({ queueLength, avgServiceMinutes = 7, doctorsOnDuty = 1 }) {
	const perPatient = Math.max(3, Math.min(20, avgServiceMinutes));
	const effectiveRate = perPatient / Math.max(1, doctorsOnDuty);
	return Math.round(queueLength * effectiveRate);
}



