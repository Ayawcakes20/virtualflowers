"use client";

import { motion } from "motion/react";
import { surprise } from "@/config/surprise";

export function BouquetWrapper({ reduced, back = false }: { reduced: boolean; back?: boolean }) {
  return <motion.g initial={reduced ? false : { opacity: 0, scaleY: .2 }} animate={{ opacity: 1, scaleY: 1 }}
    style={{ originX: "300px", originY: "490px", transformBox: "view-box" }}
    transition={{ duration: reduced ? 0 : .7 * surprise.timing.growthSpeed, delay: reduced ? 0 : surprise.timing.wrapper * surprise.timing.growthSpeed }}>
    {back ? <>
      <path d="M169 305 Q191 288 205 306 L230 293 L285 315 L342 296 L369 309 Q398 293 429 303 L352 493 L263 493Z" fill="#FFFBEB" stroke="#D9CDB3" strokeWidth="1.5" />
      <path d="M164 318 L205 295 L298 356 L402 295 L435 320 L350 495 L264 495Z" fill="#CDB8DE" stroke="#AE93C3" strokeWidth="1.4" />
    </> : <>
      <path d="M171 320 Q240 360 303 354 Q373 349 430 318 L348 494 Q305 506 262 493Z" fill="url(#wrapper-lavender)" stroke="#B6A0CD" strokeWidth="1.5" />
      <path d="M171 320 Q216 344 303 354 L348 494 Q305 477 262 493Z" fill="#E3D7EE" />
      <path d="M430 318 Q375 380 307 421 Q300 453 348 494 L389 404Z" fill="#C0A6D5" />
      <path d="M171 320 Q224 370 273 394 L262 493" stroke="#F4EDF9" strokeWidth="2" fill="none" />
      <path d="M181 337 Q241 374 282 378 M197 356 Q238 381 256 383 M398 355 L366 405" stroke="#B79ACB" strokeWidth="1" opacity=".45" fill="none" />
      <path d="M221 414 Q303 438 383 409" stroke="#715085" strokeWidth="6" fill="none" />
      <path d="M221 412 Q303 436 383 407" stroke="#AB88C1" strokeWidth="3" fill="none" />
      <path d="M303 425 C256 377 233 410 262 426 Q284 434 303 425 C350 379 365 410 342 424 Q326 434 303 425" fill="#BB9CD3" stroke="#78568F" strokeWidth="2" />
      <path d="M303 426 Q297 466 272 478 L280 455 L271 451 Q289 441 297 426 M307 426 Q330 448 335 469 L344 451 Q326 432 312 424" fill="#9C78B4" stroke="#78568F" strokeWidth="1" />
      <ellipse cx="305" cy="425" rx="8" ry="6" fill="#8F6AA7" />
      <g transform="translate(342 382) rotate(13)">
        <path d="M-17 0 Q-26 -15 -12 -20 Q-4 -22 0 -13 Q7 -23 16 -18 Q31 -8 0 17Z" fill="#FFF8ED" stroke="#C3AACD" strokeWidth="1" />
        <path d="M-6 -7 C-11 -14 -18 -5 0 5 C18 -5 11 -14 6 -7 Q0 -1 -6 -7Z" fill="#A07BB5" transform="scale(.65)" />
      </g>
    </>}
  </motion.g>;
}
