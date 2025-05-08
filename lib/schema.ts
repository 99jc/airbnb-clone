import { z } from "zod";

export const searchSchema = z.object({
  spotName: z.string().optional(),
  date: z.object({
    checkIn: z.date().optional(),
    checkOut: z.date().optional(),
    marginOfDate: z.number().optional(),
  }),
  flexibleMonth: z.array(
    z.object({
      month: z.number().optional(),
      year: z.number().optional(),
    })
  ),
  people: z.object({
    adult: z.number().min(0),
    child: z.number().min(0),
    baby: z.number().min(0),
    pet: z.number().min(0),
  }),
});

export const loginWithPhoneNumberSchema = z.object({
  country: z.number(),
  phoneNumber: z.string().refine((num) => /^\d{8}$/.test(num.toString()), {
    message: "전화번호가 너무 짧거나 유효하지 않은 문자를 포함합니다.",
  }),
});

export const signInWithIdPassword = z.object({
  password: z.string(),
});

export const searchAccountByEmail = z.object({
  email: z.string().email(),
});

export const signUpWithCredential = z.object({
  email: z.string().email(),
  password: z.string(),
  name: z.string(),
  familyName: z.string(),
  birthYear: z.number(),
  birthMonth: z.number(),
  birthDay: z.number(),
  personalInformation: z.boolean(),
  receiveEmail: z.boolean(),
});

export const hosting = z.object({
  tag: z.string().optional(),
  type: z.string().optional(),
  address: z.string(),
  image: z.array(z.string()),
});

export const tag = z.object({
  tag: z.string().optional(),
});

export const hostingRoomType = z.object({
  type: z.string().optional(),
});

export const address = z.object({
  address: z.string(),
});

export const hostingImages = z.object({
  image: z.array(z.string()),
});
