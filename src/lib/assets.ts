const GROWCRED_BASE = "/assets/growcred";
const FIRST_BATCH = `${GROWCRED_BASE}/01_first_batch_site_assets`;
const SECOND_BATCH = `${GROWCRED_BASE}/02_second_batch_individual_assets`;
const CLEAN_BRAND = `${GROWCRED_BASE}/processed/brand`;
const CLEAN_STICKERS = `${GROWCRED_BASE}/processed/stickers`;

export const GROWCRED_ASSETS = {
  brand: {
    logoWordmark: `${CLEAN_BRAND}/01_growcred_full_logo_wordmark.png`,
    logoEmblem: `${CLEAN_BRAND}/02_growcred_logo_emblem.png`,
    treeCoin: `${FIRST_BATCH}/03_treecoin_gold_medallion.png`,
  },
  site: {
    heroLanding: `${FIRST_BATCH}/04_homepage_hero_app_landing.png`,
    proofLoop: `${FIRST_BATCH}/05_plant_prove_protect_loop.png`,
    dashboardTrackImpact: `${FIRST_BATCH}/06_dashboard_track_impact.png`,
    treeCareGuide: `${FIRST_BATCH}/07_tree_care_guide.png`,
    challengeBanners: {
      birthdayTree: `${FIRST_BATCH}/08_birthday_tree_challenge_banner.png`,
      oneStudentOneTree: `${FIRST_BATCH}/09_one_student_one_tree_campaign.png`,
      friendsGreen: `${FIRST_BATCH}/10_friends_green_challenge_banner.png`,
    },
  },
  onboarding: {
    startGreenJourney: `${SECOND_BATCH}/onboarding_01_start_green_journey.png`,
    plantProveProtect: `${SECOND_BATCH}/onboarding_02_plant_prove_protect.png`,
    impactMatters: `${SECOND_BATCH}/onboarding_03_impact_matters.png`,
  },
  states: {
    noTrees: `${SECOND_BATCH}/empty_state_no_trees.png`,
    noProofs: `${SECOND_BATCH}/empty_state_no_proofs.png`,
    noReminders: `${SECOND_BATCH}/empty_state_no_reminders.png`,
    noChallenges: `${SECOND_BATCH}/empty_state_no_challenges.png`,
    proofSubmitted: `${SECOND_BATCH}/success_proof_submitted.png`,
    underReview: `${SECOND_BATCH}/under_review_illustration.png`,
    rejectedProof: `${SECOND_BATCH}/rejected_proof_illustration.png`,
  },
  stickers: {
    birthdayTreeReward: `${CLEAN_STICKERS}/birthday_tree_reward_badge.webp`,
    plantToday: `${CLEAN_STICKERS}/plant_today_eco_badge_design.webp`,
    proveImpact: `${CLEAN_STICKERS}/prove_impact_with_green_energy.webp`,
    earnGreen: `${CLEAN_STICKERS}/earn_green_with_nature_s_rewards.webp`,
    betterTogether: `${CLEAN_STICKERS}/better_together_with_a_heart_earth.webp`,
    smallActionsBigFuture: `${CLEAN_STICKERS}/small_actions_big_future_badge.webp`,
    proofBeatsPromises: `${CLEAN_STICKERS}/proof_beats_promises_with_impact.webp`,
    nativeTreesOnly: `${CLEAN_STICKERS}/native_trees_only_eco_sticker.webp`,
    trackVerifyGrow: `${CLEAN_STICKERS}/track_verify_grow_sticker_design.webp`,
    beTheChange: `${CLEAN_STICKERS}/be_the_change_sticker_design.webp`,
  },
} as const;
