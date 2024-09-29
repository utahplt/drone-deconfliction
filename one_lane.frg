#lang forge/temporal

option max_tracelength 20
option min_tracelength 20

-- This assumes no collision until the lasso state
-- this can be configured to be diffrent
-- assumes a flight buffer of 1

sig UAV {
  planedSpeed: one Int,
  earlyistEntry: one Int,
  latestEntry: one Int,
  var flying: one Int,
  var distance: one Int
}

one sig TimeStep {
  var t: one Int
}

pred validUAV {
  all x: UAV {
    (x.flying = 0 or x.flying = 1) and
    x.earlyistEntry >= 0 and
    x.latestEntry >= x.earlyistEntry and
    x.planedSpeed > 0 and
    (TimeStep.t < x.earlyistEntry => x.flying = 0) and
    (TimeStep.t > x.latestEntry => x.flying = 1) and
    (x.flying = 1 => x.flying' = 1) and
    x.distance >= 0
    -- TODO just tmp to help w/ viz
    and x.latestEntry < 10
  }
}

pred startState {
  all uav: UAV | uav.flying = 0 and uav.distance = 0
}

pred uavNeverTouching {
  all disj u0, u1: UAV {
    (u0.flying = 1 and u1.flying = 1) => (u0.distance != u1.distance)
  }
}

pred uavMove {
  (all uav: UAV | uav.flying = 0 => uav.distance = uav.distance') and
  (all uav: UAV | uav.flying = 1 => uav.distance' = add[uav.distance, uav.planedSpeed])
}

run {
  startState
  TimeStep.t = 0
  always {
    -- TODO 19 is hardcoded to force the latest loopback possible
    -- kinda hacky :/
    TimeStep.t = 19 => TimeStep.t' = TimeStep.t else
    (TimeStep.t' = add[TimeStep.t, 1] and uavMove and validUAV and uavNeverTouching)
  }
} for exactly 4 UAV, 6 Int

-- NOTES
-- weird hacks due to having stop the timeStepping when I run out of tracelength
-- unclear how long lanes should be
