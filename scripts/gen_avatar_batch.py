"""Batch driver for gen_avatar.py — generates every (gender x frame)
combination for one race x life-stage at a time, sequential calls (avoids
429s), 2s between calls.

Usage: python scripts/gen_avatar_batch.py <race> <lifeStage>
"""
import sys
import time
from gen_avatar import generate

race, life_stage = sys.argv[1], sys.argv[2]

for gender in ["male", "female"]:
    for frame in ["1", "2"]:
        generate(gender, race, life_stage, frame)
        time.sleep(2)

print(f"batch done: race={race} life_stage={life_stage}")
