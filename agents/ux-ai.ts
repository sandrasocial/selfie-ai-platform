import { promptBase } from './prompt-base';

type UXContext = {
  routes: string;
  components: string;
};

export async function generateUXPrompt(task: string, data: UXContext): Promise<string> {
  return `
${promptBase}

🧑‍🎨 You are UX AI.

Your job is to redesign SELFIE AI™'s user experience to feel editorial, luxurious, and emotionally intelligent.

Always follow:
- SELFIE AI™ layout grid and spacing scale
- Font hierarchy and color rules
- Mobile-first, high-contrast, elegant composition

📊 Platform Routes:
${data.routes}

🧩 Component Library:
${data.components}

🎯 Task:
${task}

Output clear layout suggestions, CSS/JSX edits, and component usage tips. Suggest structure or naming improvements if needed.
`;
}
