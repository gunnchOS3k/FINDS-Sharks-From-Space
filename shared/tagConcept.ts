/**
 * CONCEPTUAL DESIGN — NOT PHYSICALLY DEPLOYED OR ANIMAL-TESTED
 *
 * Types for a hypothetical shark tag telemetry model described in the NASA Space Apps
 * "Sharks from Space" challenge. FINDS v2.x does not ingest live tag data, attach tags
 * to animals, or connect synthetic tag batches to production NASA hotspot scores.
 *
 * Synthetic fixtures may use these types in demo-only modules; mark payloads SYNTHETIC.
 */

/** Stable identifier for a shark individual in a conceptual tagging program. */
export interface SharkIdentity {
  /** Opaque tag-side or registry id (e.g. "shark-001"). */
  id: string;
  /** Common or scientific name for UI/education only. */
  speciesLabel: string;
  /** Optional human-readable nickname for demos. */
  displayName?: string;
}

/** Metadata for a conceptual tag hardware/software unit. */
export interface TagIdentity {
  tagId: string;
  firmwareVersion: string;
  /** ISO timestamp when the tag was conceptually attached (design doc only). */
  attachedAt: string;
  sharkId: SharkIdentity['id'];
}

/** One conceptual observation from a tag (location + optional diet proxy). */
export interface TagObservation {
  observationId: string;
  tagId: TagIdentity['tagId'];
  sharkId: SharkIdentity['id'];
  /** ISO timestamp of the observation (conceptual; not live production). */
  observedAt: string;
  lat: number;
  lon: number;
  /** Depth in meters; null if surface-only conceptual ping. */
  depthM: number | null;
  /**
   * Conceptual diet/foraging proxy (e.g. accelerometer burst, isotope stub).
   * Not measured in FINDS production.
   */
  foragingProxy: 'surface' | 'mesopelagic' | 'benthic' | 'unknown';
  /** Must be true for any demo/fixture payload using this type. */
  synthetic: true;
}

/** Batch of tag observations as might be transmitted over a low-bandwidth link. */
export interface TagTelemetryBatch {
  batchId: string;
  tagId: TagIdentity['tagId'];
  transmittedAt: string;
  observations: TagObservation[];
  /** Always SYNTHETIC in FINDS; never mixed into live NASA scoring. */
  provenance: 'SYNTHETIC' | 'FIXTURE';
}

/** Conceptual uplink state for a tag (not implemented in production). */
export interface TagTransmissionState {
  tagId: TagIdentity['tagId'];
  lastAttemptAt: string | null;
  lastSuccessAt: string | null;
  pendingBatchIds: string[];
  linkQuality: 'good' | 'degraded' | 'offline';
}

/** Example fixture — SYNTHETIC ONLY; do not wire to Worker or Gemini scoring. */
export const SYNTHETIC_TAG_BATCH_EXAMPLE: TagTelemetryBatch = {
  batchId: 'syn-batch-001',
  tagId: 'tag-concept-001',
  transmittedAt: '2025-10-05T12:00:00Z',
  provenance: 'SYNTHETIC',
  observations: [
    {
      observationId: 'syn-obs-001',
      tagId: 'tag-concept-001',
      sharkId: 'shark-concept-001',
      observedAt: '2025-10-05T11:58:00Z',
      lat: 40.12,
      lon: -73.21,
      depthM: 8,
      foragingProxy: 'surface',
      synthetic: true,
    },
  ],
};
