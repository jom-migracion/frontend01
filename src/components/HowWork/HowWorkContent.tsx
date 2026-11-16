import { Box, Typography } from '@mui/material';

const C = {
  primary: '#5B55C8',
  bodyText: '#4B5563',
  neutralText: '#1F2937',
  neutralBorder: '#E5E7EB',
  rowDivider: '#F3F4F6',
  muted: '#9CA3AF',
  stepBubbleBg: '#EFEEFF',
};

const parseBold = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} style={{ color: C.neutralText, fontWeight: 600 }}>
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
};

const CheckItem = ({ text }: { text: string }) => (
  <Box
    component="li"
    sx={{
      display: 'flex',
      gap: '10px',
      fontSize: 14,
      color: C.bodyText,
      lineHeight: 1.75,
      listStyle: 'none',
    }}
  >
    <Box
      sx={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: C.primary,
        flexShrink: 0,
        mt: '8px',
      }}
    />
    <span>{parseBold(text)}</span>
  </Box>
);

interface Step {
  title: string;
  body: string;
}

const StepList = ({ steps }: { steps: Step[] }) => (
  <Box>
    {steps.map((step, i) => (
      <Box
        key={i}
        sx={{
          display: 'flex',
          gap: '16px',
          alignItems: 'flex-start',
          pt: i === 0 ? 0 : '20px',
          pb: i === steps.length - 1 ? 0 : '20px',
          borderBottom: i < steps.length - 1 ? `1px solid ${C.rowDivider}` : 'none',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 700,
              bgcolor: C.stepBubbleBg,
              color: C.primary,
            }}
          >
            {i + 1}
          </Box>
          {i < steps.length - 1 && (
            <Box
              sx={{
                width: 2,
                flex: 1,
                minHeight: '20px',
                bgcolor: C.neutralBorder,
                mt: '4px',
              }}
            />
          )}
        </Box>

        <Box sx={{ flex: 1, pt: '6px' }}>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: C.neutralText, mb: '5px' }}>
            {step.title}
          </Typography>
          <Typography sx={{ fontSize: 14, color: C.bodyText, lineHeight: 1.75 }}>
            {parseBold(step.body)}
          </Typography>
        </Box>
      </Box>
    ))}
  </Box>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderItem = (item: any, i: number) => {
  switch (item.type) {
    case 'text':
      return (
        <Box key={i} sx={{ mb: '18px', '&:last-child': { mb: 0 } }}>
          <Typography sx={{ fontSize: 14, color: C.bodyText, lineHeight: 1.75 }}>
            {parseBold(item.text)}
          </Typography>
        </Box>
      );

    case 'step-list':
      return (
        <Box key={i} sx={{ mb: '18px', '&:last-child': { mb: 0 } }}>
          <StepList steps={item.steps} />
        </Box>
      );

    case 'check-list':
      return (
        <Box
          key={i}
          component="ul"
          sx={{
            p: 0,
            m: 0,
            mb: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            '&:last-child': { mb: 0 },
          }}
        >
          {(item.list as string[]).map((li: string, j: number) => (
            <CheckItem key={j} text={li} />
          ))}
        </Box>
      );

    default:
      return null;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const HowWorkContent = ({ sections }: { sections: any[] }) => (
  <Box sx={{ flex: 1, minWidth: 0 }}>
    {sections.map((section: any) => (
      <Box
        key={section.id}
        id={section.id}
        sx={{
          py: '40px',
          borderBottom: `1px solid ${C.neutralBorder}`,
          '@keyframes fadeUp': {
            from: { opacity: 0, transform: 'translateY(10px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
          animation: 'fadeUp 0.35s ease forwards',
          '&:last-child': { borderBottom: 'none' },
        }}
      >
        <Typography
          sx={{ fontSize: 20, fontWeight: 700, color: '#111827', mb: '20px', lineHeight: 1.3 }}
        >
          {section.title}
        </Typography>
        {section.items?.map((item: any, i: number) => renderItem(item, i))}
      </Box>
    ))}
  </Box>
);

export default HowWorkContent;
