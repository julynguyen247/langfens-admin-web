import axios from "axios";
import api, {
  apisAttempt,
  apisAuth,
  apisExam,
  apisSpeaking,
  apisVocabulary,
  apisWriting,
} from "./api.customize";

export async function addExam(
  title: string,
  slug: string,
  descriptionMd: string,
  category: string,
  level: string,
  durationMin: number
) {
  const res = await apisExam.post("/admin/exam/addexam", {
    title,
    slug,
    descriptionMd,
    category,
    level,
    durationMin,
  });

  return res;
}

export async function updateExam(
  id: string,
  title: string,
  descriptionMd: string,
  category: string,
  level: string,
  durationMin: number,
  status: string
) {
  const res = await apisExam.put(`/admin/exam/update/${id}`, {
    title,
    descriptionMd,
    category,
    level,
    durationMin,
    status,
  });

  return res;
}

export async function deleteExam(id: string) {
  const res = await apisExam.delete(`/admin/exam/delete/${id}`);
  return res;
}
export async function addOption(
  questionId: string,
  idx: number,
  contentMd: string,
  isCorrect: boolean
) {
  const res = await apisExam.post("/admin/option/add", {
    questionId,
    idx,
    contentMd,
    isCorrect,
  });

  return res;
}
export async function updateOption(
  id: string,
  questionId: string,
  idx: number,
  contentMd: string,
  isCorrect: boolean
) {
  const res = await apisExam.put(`/admin/option/update/${id}`, {
    questionId,
    idx,
    contentMd,
    isCorrect,
  });

  return res;
}
export async function deleteOption(id: string) {
  const res = await apisExam.delete(`/admin/option/delete/${id}`);
  return res;
}
export async function addQuestion(
  sectionId: string,
  idx: number,
  type: string,
  skill: string,
  difficulty: number,
  promptMd: string,
  explanationMd: string,
  blankAcceptTexts: Record<string, string[]>,
  blankAcceptRegex: Record<string, string[]>,
  matchPairs: Record<string, string[]>,
  orderCorrects: string[],
  shortAnswerAcceptTexts: string[],
  shortAnswerAcceptRegex: string[]
) {
  const res = await apisExam.post("/admin/question/add", {
    sectionId,
    idx,
    type,
    skill,
    difficulty,
    promptMd,
    explanationMd,
    blankAcceptTexts,
    blankAcceptRegex,
    matchPairs,
    orderCorrects,
    shortAnswerAcceptTexts,
    shortAnswerAcceptRegex,
  });

  return res;
}

export async function updateQuestion(
  id: string,
  sectionId: string,
  idx: number,
  type: string,
  skill: string,
  difficulty: number,
  promptMd: string,
  explanationMd: string,
  blankAcceptTexts: Record<string, string[]>,
  blankAcceptRegex: Record<string, string[]>,
  matchPairs: Record<string, string[]>,
  orderCorrects: string[],
  shortAnswerAcceptTexts: string[],
  shortAnswerAcceptRegex: string[]
) {
  const res = await apisExam.put(`/admin/question/update/${id}`, {
    sectionId,
    idx,
    type,
    skill,
    difficulty,
    promptMd,
    explanationMd,
    blankAcceptTexts,
    blankAcceptRegex,
    matchPairs,
    orderCorrects,
    shortAnswerAcceptTexts,
    shortAnswerAcceptRegex,
  });

  return res;
}

export async function deleteQuestion(id: string) {
  const res = await apisExam.delete(`/admin/question/delete/${id}`);
  return res;
}
export async function addSection(
  examId: string,
  idx: number,
  title: string,
  instructionsMd: string,
  audioUrl: string,
  transcriptMd: string
) {
  const res = await apisExam.post("/admin/section/add", {
    examId,
    idx,
    title,
    instructionsMd,
    audioUrl,
    transcriptMd,
  });

  return res;
}
export async function updateSection(
  id: string,
  examId: string,
  idx: number,
  title: string,
  instructionsMd: string,
  audioUrl: string,
  transcriptMd: string
) {
  const res = await apisExam.put(`/admin/section/update/${id}`, {
    examId,
    idx,
    title,
    instructionsMd,
    audioUrl,
    transcriptMd,
  });

  return res;
}
export async function deleteSection(id: string) {
  const res = await apisExam.delete(`/admin/section/delete/${id}`);
  return res;
}

export async function getAllPublicExams(
  page: number,
  pageSize: number,
  opts?: {
    category?: string;
    level?: string;
  }
) {
  const res = await apisExam.get("/api/public/exam/getall", {
    params: {
      page,
      pageSize,
      category: opts?.category,
      level: opts?.level,
    },
  });

  return res;
}
export async function createSpeakingExam(
  title: string,
  taskText: string,
  examType: number,
  level: string,
  tag: string
) {
  const res = await apisSpeaking.post("/admin/speaking/create", {
    title,
    taskText,
    examType,
    level,
    tag,
  });

  return res;
}
export async function updateSpeakingExam(
  id: string,
  title: string,
  taskText: string,
  examType: number,
  level: string,
  tag: string
) {
  const res = await apisSpeaking.put(`/admin/speaking/update/${id}`, {
    title,
    taskText,
    examType,
    level,
    tag,
  });

  return res;
}
export async function deleteSpeakingExam(id: string) {
  const res = await apisSpeaking.delete(`/admin/speaking/delete/${id}`);
  return res;
}
export async function getSpeakingExams() {
  const res = await apisSpeaking.get("/speaking/exams");
  return res;
}
export async function getWritingExams() {
  const res = await apisWriting.get("/writing/exams");
  return res;
}
export async function getAllAdminExams() {
  const res = await apisExam.get("/admin/exam/all");
  return res;
}
export async function createWritingExam(
  title: string,
  taskText: string,
  examType: number,
  level: string,
  tag: string
) {
  const res = await apisWriting.post("/admin/writing/create", {
    title,
    taskText,
    examType,
    level,
    tag,
  });

  return res;
}
export async function updateWritingExam(
  id: string,
  title: string,
  taskText: string,
  examType: number,
  level: string,
  tag: string
) {
  const res = await apisWriting.put(`/admin/writing/update/${id}`, {
    title,
    taskText,
    examType,
    level,
    tag,
  });

  return res;
}

// DELETE writing exam
export async function deleteWritingExam(id: string) {
  const res = await apisWriting.delete(`/admin/writing/delete/${id}`);
  return res;
}
