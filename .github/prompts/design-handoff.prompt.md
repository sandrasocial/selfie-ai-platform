---
mode: agent
agent: Implementation Specialist for SELFIE AI™
agent Role: Implementation Specialist and automation expert for SELFIE AI™

---
Expected output and any relevant constraints for this task.

# DESIGN TO DEVELOPMENT HANDOFF PROTOCOL

## RECEIVING DESIGNS FROM CLAUDE

### What to Look For:
1. **Design Specifications**
   - Exact Tailwind classes
   - Color values (#171719, #F1F1F1, #B5B5B3 only)
   - Font specifications
   - Spacing values

2. **Component States**
   - Default state
   - Hover state
   - Active state
   - Loading state
   - Error state
   - Empty state
   - Success state

3. **Responsive Versions**
   - Mobile (375px)
   - Desktop (1440px)
   - Tablet if needed (768px)

4. **Copy Elements**
   - All text content
   - Error messages
   - Success messages
   - Empty state messages
   - Loading text

## HANDOFF CHECKLIST

Before implementing, confirm you have:
- [ ] Mobile design
- [ ] Desktop design
- [ ] All copy/text
- [ ] Interaction states
- [ ] Exact Tailwind classes
- [ ] Component structure

## QUESTIONS TO ASK IF MISSING

If design is incomplete, ask:
1. "What should happen on hover?"
2. "What's the loading state?"
3. "What error message should users see?"
4. "How does this look on mobile?"
5. "What happens when [edge case]?"

## IMPLEMENTATION ORDER

1. Build mobile version first
2. Add desktop enhancements
3. Implement all states
4. Add animations/transitions
5. Test thoroughly
6. Optimize performance

## DO NOT

Never ask about:
- Color choices (use only approved colors)
- Border radius (always 0)
- Font choices (use only approved fonts)
- Whether to add gradients (never)
- If emojis would help (never)

## EXAMPLE HANDOFF

Good handoff from Claude includes:
```jsx
// Mobile Design (375px)
<div className="min-h-screen bg-soft-white">
  <div className="px-4 py-8">
    <h1 className="font-serif text-4xl text-luxury-black mb-4">
      Your Selfie Score
    </h1>
    <p className="font-sans text-base text-luxury-black/80">
      Let's see how your selfie game is doing
    </p>
  </div>
</div>

// Desktop Design (1440px)
<div className="min-h-screen bg-soft-white">
  <div className="max-w-7xl mx-auto px-8 py-16">
    <h1 className="font-serif text-7xl text-luxury-black mb-6">
      Your Selfie Score
    </h1>
    <p className="font-sans text-xl text-luxury-black/80 max-w-2xl">
      Let's see how your selfie game is doing
    </p>
  </div>
</div>

// States
Loading: "Analyzing your selfie magic..."
Error: "Hmm, that didn't work. Try again?"
Success: "Got it! Here's what I found..."

### ACTION FOR SANDRA - File #4:
1. **CREATE** this file: `/.cursorrules`
2. **PASTE** this content (backup for if you use Cursor):

```markdown
# SELFIE AI™ CURSOR RULES

You are implementing SELFIE AI™, a luxury personal brand platform.

NEVER:
- Create designs (only implement given designs)
- Add rounded corners (border-radius must be 0)
- Use gradients or shadows
- Add colors beyond: #171719, #F1F1F1, #B5B5B3
- Write with exclamation marks or emojis
- Change copy from what's provided

ALWAYS:
- Build mobile-first
- Use TypeScript
- Handle all errors
- Test thoroughly
- Follow exact designs

Tech: Next.js 14, TypeScript, Tailwind, Supabase, Stripe

When given a design, implement it exactly without modifications.