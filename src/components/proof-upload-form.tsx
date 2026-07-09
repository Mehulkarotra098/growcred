"use client";

import Image from "next/image";
import Link from "next/link";
import type {
  ChangeEvent,
  DragEvent,
  FormEvent,
  KeyboardEvent,
  ReactNode,
  RefObject,
} from "react";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Camera,
  CheckCircle2,
  Circle,
  Coins,
  FileImage,
  Film,
  Info,
  Loader2,
  LocateFixed,
  MapPin,
  ShieldCheck,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { submitProofAction } from "@/app/submit-proof/actions";
import type { ProofSubmissionResult } from "@/lib/types";
import { brandAssets } from "@/lib/brand-assets";
import { TREECOIN_DISCLAIMER } from "@/lib/copy";
import { createLocalProof } from "@/lib/local-growcred";
import { isSupabaseBrowserConfigured } from "@/lib/supabase/config";
import { cn } from "@/lib/utils";
import { StatusPill } from "./status-pill";

type ProofStep = {
  id: string;
  title: string;
  description: string;
};

type FileSlot = "photo" | "video";

interface ProofFormValues {
  nickname: string;
  species: string;
  plantedAt: string;
  locationName: string;
  coordinates: string;
  notes: string;
  legalConsent: boolean;
  permissionConsent: boolean;
  nativeConsent: boolean;
  careConsent: boolean;
}

const steps: ProofStep[] = [
  {
    id: "tree-details",
    title: "Tree Details",
    description: "Name the tree, species, planting date, and city.",
  },
  {
    id: "evidence",
    title: "Evidence",
    description: "Add a clear photo and an optional short video.",
  },
  {
    id: "location-permission",
    title: "Location & Permission",
    description: "Confirm where it is planted and that planting is allowed.",
  },
  {
    id: "care-commitment",
    title: "Care Commitment",
    description: "Promise the survival work that comes after planting.",
  },
  {
    id: "review-submit",
    title: "Review & Submit",
    description: "Check the proof packet before review.",
  },
];

const initialValues: ProofFormValues = {
  nickname: "",
  species: "",
  plantedAt: "",
  locationName: "",
  coordinates: "",
  notes: "",
  legalConsent: false,
  permissionConsent: false,
  nativeConsent: false,
  careConsent: false,
};

const proofTips = [
  "Show the full sapling, not only leaves.",
  "Include surrounding context so location can be reviewed.",
  "Use daylight when possible and avoid heavy filters.",
  "Add notes if permission or species context needs explanation.",
];

const reviewRows: Array<[keyof ProofFormValues, string]> = [
  ["nickname", "Tree nickname"],
  ["species", "Species"],
  ["plantedAt", "Planting date"],
  ["locationName", "Location/city"],
  ["coordinates", "GPS coordinates"],
  ["notes", "Notes"],
];

export function ProofUploadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [values, setValues] = useState<ProofFormValues>(initialValues);
  const [files, setFiles] = useState<Record<FileSlot, File | null>>({
    photo: null,
    video: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [locationMessage, setLocationMessage] = useState("");
  const [result, setResult] = useState<ProofSubmissionResult | null>(null);
  const [reviewReady, setReviewReady] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (activeStep !== steps.length - 1 || result) return;

    const timer = window.setTimeout(() => setReviewReady(true), 180);
    return () => window.clearTimeout(timer);
  }, [activeStep, result]);

  function updateValue<Key extends keyof ProofFormValues>(
    key: Key,
    value: ProofFormValues[Key],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function updateFile(slot: FileSlot, file: File | null) {
    setFiles((current) => ({ ...current, [slot]: file }));
    setErrors((current) => {
      if (!current[slot]) return current;
      const next = { ...current };
      delete next[slot];
      return next;
    });
  }

  function collectErrors(stepIndex: number) {
    const nextErrors: Record<string, string> = {};

    if (stepIndex === 0) {
      if (!values.nickname.trim()) nextErrors.nickname = "Add a tree nickname.";
      if (!values.species.trim()) nextErrors.species = "Add the tree species.";
      if (!values.plantedAt) nextErrors.plantedAt = "Choose the planting date.";
      if (!values.locationName.trim()) {
        nextErrors.locationName = "Add the location or city.";
      }
    }

    if (stepIndex === 1) {
      if (!files.photo) {
        nextErrors.photo = "Upload at least one clear tree photo.";
      } else if (!files.photo.type.startsWith("image/")) {
        nextErrors.photo = "Photo evidence must be an image file.";
      } else if (files.photo.size > 15 * 1024 * 1024) {
        nextErrors.photo = "Photo must be 15MB or smaller.";
      }

      if (files.video) {
        if (!files.video.type.startsWith("video/")) {
          nextErrors.video = "Video evidence must be a video file.";
        } else if (files.video.size > 80 * 1024 * 1024) {
          nextErrors.video = "Video must be 80MB or smaller.";
        }
      }
    }

    if (stepIndex === 2) {
      if (!values.permissionConsent) {
        nextErrors.permissionConsent = "Confirm land permission.";
      }
      if (!values.nativeConsent) {
        nextErrors.nativeConsent = "Confirm native or local suitability.";
      }
    }

    if (stepIndex === 3) {
      if (!values.careConsent) {
        nextErrors.careConsent = "Confirm your care commitment.";
      }
      if (!values.legalConsent) {
        nextErrors.legalConsent = "Confirm the proof is truthful.";
      }
    }

    return nextErrors;
  }

  function validateStep(stepIndex: number) {
    const nextErrors = collectErrors(stepIndex);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function validateAll() {
    for (let index = 0; index < steps.length - 1; index += 1) {
      const nextErrors = collectErrors(index);
      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors);
        setActiveStep(index);
        return false;
      }
    }

    setErrors({});
    return true;
  }

  function goNext() {
    if (!validateStep(activeStep)) return;
    setReviewReady(false);
    setActiveStep((current) => Math.min(current + 1, steps.length - 1));
  }

  function goBack() {
    setErrors({});
    setReviewReady(false);
    setActiveStep((current) => Math.max(current - 1, 0));
  }

  function jumpToStep(index: number) {
    if (index <= activeStep) {
      setErrors({});
      setReviewReady(false);
      setActiveStep(index);
      return;
    }

    if (!validateStep(activeStep)) return;
    setReviewReady(false);
    setActiveStep(index);
  }

  function useCurrentLocation() {
    setLocationMessage("");

    if (!navigator.geolocation) {
      setLocationMessage("Location access is not available in this browser.");
      return;
    }

    setLocationMessage("Requesting location permission...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextCoordinates = `${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}`;
        updateValue("coordinates", nextCoordinates);
        setLocationMessage("Location added. Review before submitting.");
      },
      () => {
        setLocationMessage("Location permission was not granted. You can add coordinates manually.");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (activeStep !== steps.length - 1 || !reviewReady) return;

    setResult(null);

    if (!validateAll()) return;

    const form = event.currentTarget;
    startTransition(async () => {
      let nextResult: ProofSubmissionResult;

      if (isSupabaseBrowserConfigured()) {
        const formData = new FormData(form);
        if (files.photo) formData.set("photo", files.photo, files.photo.name);
        if (files.video) formData.set("video", files.video, files.video.name);
        nextResult = await submitProofAction(formData);
      } else {
        try {
          const localProof = await createLocalProof({
            nickname: values.nickname,
            species: values.species,
            plantedAt: values.plantedAt,
            locationName: values.locationName,
            coordinates: values.coordinates,
            notes: values.notes,
            photoFile: files.photo!,
            videoFile: files.video,
          });

          nextResult = {
            ok: true,
            mode: "preview",
            message: "Your proof is ready for review.",
            treeId: localProof.tree.id,
            proofSubmissionId: localProof.proof.id,
            status: "under_review",
          };
        } catch {
          nextResult = {
            ok: false,
            mode: "preview",
            message: "We could not save this proof in the browser.",
            issues: [
              "Try a smaller photo or clear old browser storage before submitting again.",
            ],
          };
        }
      }

      setResult(nextResult);

      if (nextResult.ok) {
        form.reset();
        setValues(initialValues);
        setFiles({ photo: null, video: null });
        setActiveStep(0);
      }
    });
  }

  if (result?.ok) {
  return (
    <section className="living-card p-5 sm:p-7">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.72fr] lg:items-center">
          <div>
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-[0.95rem] bg-lime/45 text-forest">
              <CheckCircle2 aria-hidden="true" className="h-7 w-7" />
            </span>
            <h2 className="mt-5 text-3xl font-black text-forest">
              Your proof is ready for review.
            </h2>
            <p className="mt-3 max-w-2xl text-sm font-bold leading-7 text-forest/65">
              {result.message} A GrowCred reviewer can check the evidence,
              permission, species fit, and care commitment before TreeCoins are
              approved.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[0.95rem] border border-lime/40 bg-lime/16 p-5">
                <p className="text-sm font-black uppercase tracking-[0.12em] text-forest/55">
                  Status
                </p>
                <div className="mt-3">
                  <StatusPill status="under_review" />
                </div>
                <p className="mt-3 text-sm font-bold leading-6 text-forest/65">
                  Under Review: the proof has been submitted and is waiting for
                  verification.
                </p>
              </div>
              <div className="rounded-[0.95rem] border border-leaf/20 bg-white/70 p-5">
                <div className="flex items-center gap-3">
                  <Image
                    src={brandAssets.treeCoin}
                    alt="TreeCoin gold reward point"
                    width={72}
                    height={72}
                    className="h-12 w-12"
                  />
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.12em] text-forest/55">
                      Reward preview
                    </p>
                    <p className="text-2xl font-black text-forest">
                      +10 TreeCoins
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm font-bold leading-6 text-forest/65">
                  TreeCoins are added after approval.
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-[0.9rem] bg-forest px-5 py-3 text-sm font-black text-white transition hover:bg-leaf focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
              >
                View Dashboard
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={() => setResult(null)}
                className="inline-flex items-center justify-center rounded-[0.9rem] border border-forest/10 bg-white px-5 py-3 text-sm font-black text-forest transition hover:bg-lime/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
              >
                Submit Another Proof
              </button>
            </div>
          </div>
          <div className="forest-panel rounded-[0.9rem] p-6 text-white">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-lime">
              Next action
            </p>
            <h3 className="mt-3 text-2xl font-black">
              Keep the tree alive.
            </h3>
            <p className="mt-3 text-sm font-semibold leading-7 text-white/72">
              Return with care updates after watering, protection, and survival
              milestones. The strongest proof shows the same tree over time.
            </p>
            <p className="mt-5 rounded-[0.95rem] bg-white/10 p-4 text-xs font-bold leading-6 text-white/68">
              {TREECOIN_DISCLAIMER}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="living-card min-w-0 p-4 sm:p-6 lg:p-7"
    >
      <div className="grid gap-6 xl:grid-cols-[13.5rem_minmax(0,1fr)]">
        <aside className="order-2 rounded-[0.85rem] border border-forest/10 bg-white/70 p-4 xl:order-none">
          <div className="flex items-center gap-3 rounded-[0.9rem] bg-lime/18 p-4">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-forest shadow-sm">
              <ShieldCheck aria-hidden="true" className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-black text-forest">
                Preview the proof flow.
              </p>
              <Link
                href="/auth"
                className="mt-1 inline-flex min-h-8 items-center rounded-[0.55rem] pr-2 text-xs font-black text-leaf underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
              >
                Sign in to track your impact.
              </Link>
            </div>
          </div>

          <ol className="mt-5 grid gap-2" aria-label="Proof submission steps">
            {steps.map((step, index) => {
              const isActive = activeStep === index;
              const isComplete = index < activeStep;

              return (
                <li key={step.id}>
                  <button
                    type="button"
                    onClick={() => jumpToStep(index)}
                    aria-current={isActive ? "step" : undefined}
                    className={cn(
                      "grid w-full grid-cols-[2rem_1fr] items-start gap-3 rounded-[0.75rem] p-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf",
                      isActive
                        ? "bg-forest text-white"
                        : isComplete
                          ? "bg-lime/25 text-forest"
                          : "text-forest hover:bg-off-white",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 grid h-8 w-8 place-items-center rounded-full text-xs font-black",
                        isActive
                          ? "bg-lime text-forest"
                          : isComplete
                            ? "bg-leaf text-white"
                            : "bg-forest/10 text-forest",
                      )}
                    >
                      {isComplete ? (
                        <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
                      ) : (
                        index + 1
                      )}
                    </span>
                    <span>
                      <span className="block text-sm font-black">
                        {step.title}
                      </span>
                      <span
                        className={cn(
                          "mt-1 block text-xs font-bold leading-5",
                          isActive ? "text-white/68" : "text-forest/50",
                        )}
                      >
                        {step.description}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </aside>

        <div className="order-1 min-w-0 xl:order-none">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-leaf">
                Step {activeStep + 1} of {steps.length}
              </p>
              <h2 className="mt-1 text-3xl font-black tracking-tight text-forest">
                {steps[activeStep].title}
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-[0.75rem] bg-lime/25 px-4 py-2 text-sm font-black text-forest">
              <Coins aria-hidden="true" className="h-4 w-4" />
              +10 TreeCoins after approval
            </div>
          </div>

          {result && !result.ok ? (
            <div
              role="alert"
              className="mb-6 rounded-[1rem] border border-red-200 bg-red-50 p-4 text-sm font-bold leading-6 text-red-800"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[0.9rem] bg-red-100 text-red-700">
                  <Info aria-hidden="true" className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-black">{result.message}</p>
                  {result.issues?.length ? (
                    <ul className="mt-2 list-disc space-y-1 pl-5">
                      {result.issues.map((issue) => (
                        <li key={issue}>{issue}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}

          <div className="grid gap-5">
            <StepPanel active={activeStep === 0}>
              <div className="grid gap-4 lg:grid-cols-2">
                <TextField
                  label="Tree nickname"
                  name="nickname"
                  value={values.nickname}
                  onChange={(value) => updateValue("nickname", value)}
                  placeholder="Nimmy"
                  error={errors.nickname}
                />
                <TextField
                  label="Tree species"
                  name="species"
                  value={values.species}
                  onChange={(value) => updateValue("species", value)}
                  placeholder="Neem, Jamun, Mango"
                  error={errors.species}
                />
                <TextField
                  label="Planting date"
                  name="plantedAt"
                  type="date"
                  value={values.plantedAt}
                  onChange={(value) => updateValue("plantedAt", value)}
                  error={errors.plantedAt}
                  icon={<Calendar aria-hidden="true" className="h-4 w-4" />}
                  className="lg:col-span-2"
                />
                <TextField
                  label="Location/city"
                  name="locationName"
                  value={values.locationName}
                  onChange={(value) => updateValue("locationName", value)}
                  placeholder="School garden, Delhi"
                  error={errors.locationName}
                  icon={<MapPin aria-hidden="true" className="h-4 w-4" />}
                  className="lg:col-span-2"
                />
              </div>
            </StepPanel>

            <StepPanel active={activeStep === 1}>
              <div className="grid gap-5 lg:grid-cols-2">
                <UploadCard
                  title="Upload photo"
                  description="Required. Use a clear photo showing the full tree and surroundings."
                  accept="image/*"
                  slot="photo"
                  inputRef={photoInputRef}
                  file={files.photo}
                  error={errors.photo}
                  onFileChange={updateFile}
                  icon={<FileImage aria-hidden="true" className="h-6 w-6" />}
                />
                <UploadCard
                  title="Upload video"
                  description="Optional. Add a short walkaround video if it helps verification."
                  accept="video/*"
                  slot="video"
                  inputRef={videoInputRef}
                  file={files.video}
                  error={errors.video}
                  optional
                  onFileChange={updateFile}
                  icon={<Film aria-hidden="true" className="h-6 w-6" />}
                />
              </div>
              <ProofTips />
            </StepPanel>

            <StepPanel active={activeStep === 2}>
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_0.85fr]">
                <div className="grid gap-4">
                  <TextField
                    label="GPS coordinates optional"
                    name="coordinates"
                    value={values.coordinates}
                    onChange={(value) => updateValue("coordinates", value)}
                    placeholder="28.53550, 77.24010"
                    error={errors.coordinates}
                    icon={<LocateFixed aria-hidden="true" className="h-4 w-4" />}
                  />
                  <button
                    type="button"
                    onClick={useCurrentLocation}
                    className="inline-flex w-fit items-center gap-2 rounded-[0.9rem] bg-forest px-5 py-3 text-sm font-black text-white transition hover:bg-leaf focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
                  >
                    <LocateFixed aria-hidden="true" className="h-4 w-4" />
                    Use my current location
                  </button>
                  {locationMessage ? (
                    <p className="text-sm font-bold leading-6 text-forest/65">
                      {locationMessage}
                    </p>
                  ) : null}
                </div>
                <div className="rounded-[0.95rem] border border-aqua/20 bg-aqua/10 p-5">
                  <Info aria-hidden="true" className="h-5 w-5 text-forest" />
                  <h3 className="mt-3 text-lg font-black text-forest">
                    Permission matters.
                  </h3>
                  <p className="mt-2 text-sm font-bold leading-6 text-forest/65">
                    A strong proof packet shows the tree was planted where care
                    access is allowed and survival is realistic.
                  </p>
                </div>
              </div>
              <div className="mt-5 grid gap-3">
                <ConsentBox
                  name="permissionConsent"
                  checked={values.permissionConsent}
                  onChange={(checked) => updateValue("permissionConsent", checked)}
                  title="I have permission to plant and care for this tree at this location."
                  error={errors.permissionConsent}
                />
                <ConsentBox
                  name="nativeConsent"
                  checked={values.nativeConsent}
                  onChange={(checked) => updateValue("nativeConsent", checked)}
                  title="This tree is native or locally suitable for the planting area."
                  error={errors.nativeConsent}
                />
              </div>
            </StepPanel>

            <StepPanel active={activeStep === 3}>
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_0.9fr]">
                <label className="grid gap-2 text-sm font-black text-forest">
                  Notes optional
                  <textarea
                    aria-label="Notes optional"
                    name="notes"
                    value={values.notes}
                    onChange={(event) => updateValue("notes", event.target.value)}
                    rows={7}
                    placeholder="Add care plan, permission context, landmark, or anything the reviewer should know."
                    className="min-h-40 resize-y rounded-[0.95rem] border border-forest/15 bg-off-white px-4 py-3 text-sm font-bold leading-6 text-forest placeholder:text-forest/35 focus:outline-none focus:ring-2 focus:ring-leaf/40"
                  />
                </label>
                <div className="forest-panel rounded-[1rem] p-5 text-white">
                  <Sparkles aria-hidden="true" className="h-6 w-6 text-lime" />
                  <h3 className="mt-4 text-2xl font-black">
                    Protect it after the upload.
                  </h3>
                  <p className="mt-3 text-sm font-semibold leading-7 text-white/70">
                    GrowCred rewards survival care, not one-time planting. Return
                    with check-ins when the tree needs water, protection, or
                    survival proof.
                  </p>
                </div>
              </div>
              <div className="mt-5 grid gap-3">
                <ConsentBox
                  name="careConsent"
                  checked={values.careConsent}
                  onChange={(checked) => updateValue("careConsent", checked)}
                  title="I commit to caring for this tree and uploading future care proof."
                  error={errors.careConsent}
                />
                <ConsentBox
                  name="legalConsent"
                  checked={values.legalConsent}
                  onChange={(checked) => updateValue("legalConsent", checked)}
                  title="I confirm this proof is truthful and matches the tree shown."
                  error={errors.legalConsent}
                />
              </div>
            </StepPanel>

            <StepPanel active={activeStep === 4}>
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_0.82fr]">
                <div className="rounded-[1rem] border border-forest/10 bg-white/70 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.12em] text-leaf">
                        Proof packet
                      </p>
                      <h3 className="mt-1 text-2xl font-black text-forest">
                        Ready for review
                      </h3>
                    </div>
                    <StatusPill status="under_review" />
                  </div>
                  <dl className="mt-5 grid gap-3">
                    {reviewRows.map(([key, label]) => (
                      <div
                        key={key}
                        className="grid gap-1 rounded-[0.85rem] bg-off-white p-4 sm:grid-cols-[10rem_1fr]"
                      >
                        <dt className="text-xs font-black uppercase tracking-[0.1em] text-forest/45">
                          {label}
                        </dt>
                        <dd className="text-sm font-black text-forest">
                          {values[key] || "Not added"}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="grid gap-4">
                  <EvidenceSummary
                    label="Photo evidence"
                    file={files.photo}
                    required
                  />
                  <EvidenceSummary label="Video evidence" file={files.video} />
                  <div className="rounded-[0.95rem] bg-lime/18 p-5">
                    <div className="flex items-center gap-3">
                      <Image
                        src={brandAssets.treeCoin}
                        alt="TreeCoin gold reward point"
                        width={72}
                        height={72}
                        className="h-12 w-12"
                      />
                      <div>
                        <p className="text-sm font-black text-forest/55">
                          Reward preview
                        </p>
                        <p className="text-2xl font-black text-forest">
                          +10 TreeCoins after approval
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 text-xs font-bold leading-6 text-forest/60">
                      {TREECOIN_DISCLAIMER}
                    </p>
                  </div>
                </div>
              </div>
            </StepPanel>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={goBack}
              disabled={activeStep === 0 || isPending}
              className="inline-flex items-center justify-center gap-2 rounded-[0.9rem] border border-forest/10 bg-white px-5 py-3 text-sm font-black text-forest transition hover:bg-lime/20 disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              Back
            </button>

            {activeStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={goNext}
                disabled={isPending}
                className="inline-flex items-center justify-center gap-2 rounded-[0.9rem] bg-forest px-6 py-3 text-sm font-black text-white shadow-xl shadow-forest/15 transition hover:bg-leaf disabled:cursor-wait disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
              >
                Continue
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isPending || !reviewReady}
                className="inline-flex items-center justify-center gap-2 rounded-[0.9rem] bg-leaf px-6 py-3 text-sm font-black text-white shadow-xl shadow-leaf/20 transition hover:bg-forest disabled:cursor-wait disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
              >
                {isPending ? (
                  <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
                )}
                Submit for Review
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

function StepPanel({
  active,
  children,
}: {
  active: boolean;
  children: ReactNode;
}) {
  return (
    <section hidden={!active} className="rounded-[0.85rem] bg-white/55 p-4 sm:p-5">
      {children}
    </section>
  );
}

function TextField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  icon,
  className,
}: {
  label: string;
  name: keyof ProofFormValues;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  icon?: ReactNode;
  className?: string;
}) {
  const errorId = `${name}-error`;

  return (
    <label className={cn("grid min-w-0 gap-2 text-sm font-black text-forest", className)}>
      {label}
      <span
        className={cn(
          "grid min-h-[3.35rem] min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-2 rounded-[0.75rem] border bg-off-white px-3 py-1 sm:gap-3 sm:px-4",
          !icon && "grid-cols-1",
          error ? "border-red-300 ring-2 ring-red-100" : "border-forest/15",
        )}
      >
        {icon ? <span className="pointer-events-none shrink-0 text-leaf">{icon}</span> : null}
        <input
          aria-label={label}
          name={name}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="min-h-[2.9rem] w-full min-w-0 bg-transparent text-sm font-bold leading-none text-forest placeholder:text-forest/35 focus:outline-none [&::-webkit-calendar-picker-indicator]:opacity-70"
        />
      </span>
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
    </label>
  );
}

function UploadCard({
  title,
  description,
  accept,
  slot,
  inputRef,
  file,
  error,
  optional = false,
  icon,
  onFileChange,
}: {
  title: string;
  description: string;
  accept: string;
  slot: FileSlot;
  inputRef: RefObject<HTMLInputElement | null>;
  file: File | null;
  error?: string;
  optional?: boolean;
  icon: ReactNode;
  onFileChange: (slot: FileSlot, file: File | null) => void;
}) {
  const inputId = `${slot}-upload`;
  const errorId = `${slot}-error`;

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    onFileChange(slot, event.target.files?.[0] ?? null);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    onFileChange(slot, event.dataTransfer.files?.[0] ?? null);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLLabelElement>) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    inputRef.current?.click();
  }

  function clearFile() {
    onFileChange(slot, null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <label
        htmlFor={inputId}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        className={cn(
          "group grid min-h-56 cursor-pointer place-items-center rounded-[0.85rem] border-2 border-dashed bg-off-white p-5 text-center transition hover:border-leaf hover:bg-lime/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf",
          error ? "border-red-300 ring-2 ring-red-100" : "border-forest/15",
        )}
      >
        <input
          ref={inputRef}
          id={inputId}
          name={slot}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          aria-label={`${title} file input`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="sr-only"
        />
        <span className="grid justify-items-center">
          <span className="grid h-14 w-14 place-items-center rounded-[0.75rem] bg-lime/40 text-forest">
            {file ? (
              <CheckCircle2 aria-hidden="true" className="h-6 w-6" />
            ) : (
              icon
            )}
          </span>
          <span className="mt-4 text-lg font-black text-forest">{title}</span>
          <span className="mt-2 max-w-xs text-sm font-bold leading-6 text-forest/60">
            {description}
          </span>
          <span className="mt-4 inline-flex items-center gap-2 rounded-[0.7rem] bg-white px-4 py-2 text-xs font-black text-forest shadow-sm ring-1 ring-forest/10">
            <UploadCloud aria-hidden="true" className="h-4 w-4 text-leaf" />
            Drag and drop or choose file
          </span>
          {optional ? (
            <span className="mt-3 text-xs font-black uppercase tracking-[0.12em] text-forest/40">
              Optional
            </span>
          ) : null}
        </span>
      </label>

      {file ? (
        <div className="mt-3 overflow-hidden rounded-[0.75rem] bg-white/75 p-3 text-sm font-bold text-forest ring-1 ring-forest/10">
          <div className="grid gap-3">
            <FilePreview file={file} label={title} />
            <div className="min-w-0">
              <p className="break-all font-black">{file.name}</p>
              <p className="mt-1 text-xs font-bold text-forest/52">
                {formatFileSize(file.size)}
              </p>
              <button
                type="button"
                onClick={clearFile}
                aria-label={`Remove ${title.toLowerCase()} file`}
                className="mt-3 rounded-[0.7rem] px-3 py-1 text-xs font-black text-forest/60 transition hover:bg-forest/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-3 rounded-[0.75rem] bg-white/70 p-3 text-sm font-bold text-forest/55">
          Image/video preview appears here after upload.
        </div>
      )}
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
    </div>
  );
}

function FilePreview({ file, label }: { file: File; label: string }) {
  const previewUrl = useMemo(() => URL.createObjectURL(file), [file]);

  useEffect(() => {
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  if (file.type.startsWith("image/")) {
    return (
      <div className="aspect-[16/9] overflow-hidden rounded-[0.9rem] bg-off-white ring-1 ring-forest/10">
        {/* eslint-disable-next-line @next/next/no-img-element -- Local blob previews cannot be optimized by next/image. */}
        <img
          src={previewUrl}
          alt={`${label} preview`}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="grid aspect-[16/9] place-items-center rounded-[0.9rem] bg-forest text-white ring-1 ring-forest/10">
      <Film aria-hidden="true" className="h-7 w-7" />
      <span className="sr-only">{label} preview selected</span>
    </div>
  );
}

function ConsentBox({
  name,
  checked,
  onChange,
  title,
  error,
}: {
  name: keyof ProofFormValues;
  checked: boolean;
  onChange: (checked: boolean) => void;
  title: string;
  error?: string;
}) {
  const errorId = `${name}-error`;

  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-[0.8rem] border bg-white/70 p-4 transition hover:bg-lime/15",
        error ? "border-red-300 ring-2 ring-red-100" : "border-forest/10",
      )}
    >
      <input
        aria-label={title}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="mt-1 h-5 w-5 rounded border-forest/20 text-leaf focus:ring-leaf"
      />
      <span className="grid">
        <span className="text-sm font-black leading-6 text-forest">{title}</span>
        {error ? <FieldError id={errorId}>{error}</FieldError> : null}
      </span>
    </label>
  );
}

function ProofTips() {
  return (
    <div className="mt-5 rounded-[1rem] border border-lime/40 bg-lime/14 p-5">
      <div className="flex items-center gap-2">
        <Camera aria-hidden="true" className="h-5 w-5 text-forest" />
        <h3 className="text-lg font-black text-forest">Proof quality tips</h3>
      </div>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {proofTips.map((tip) => (
          <li key={tip} className="flex gap-2 text-sm font-bold leading-6 text-forest/70">
            <CheckCircle2 aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-leaf" />
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}

function EvidenceSummary({
  label,
  file,
  required = false,
}: {
  label: string;
  file: File | null;
  required?: boolean;
}) {
  return (
    <div className="rounded-[0.95rem] border border-forest/10 bg-white/70 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black text-forest">{label}</p>
          <p className="mt-1 text-xs font-bold text-forest/50">
            {required ? "Required" : "Optional"}
          </p>
        </div>
        {file ? (
          <CheckCircle2 aria-hidden="true" className="h-5 w-5 text-leaf" />
        ) : (
          <Circle aria-hidden="true" className="h-5 w-5 text-forest/25" />
        )}
      </div>
      <p className="mt-3 break-words text-sm font-bold text-forest/65">
        {file ? `${file.name} - ${formatFileSize(file.size)}` : "No file added"}
      </p>
    </div>
  );
}

function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <span id={id} role="alert" className="text-xs font-black text-red-700">
      {children}
    </span>
  );
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}
