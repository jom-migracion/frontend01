import { Box, Typography } from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

const C = {
  primary: '#5B55C8',
  bodyText: '#4B5563',
  neutralText: '#1F2937',
  neutralBg: '#F8F9FC',
  neutralBorder: '#E5E7EB',
  muted: '#9CA3AF',
  softHighlight: '#EFEEFF',
  greenBg: '#F0FDF4',
  greenBorder: '#16A34A',
  greenText: '#166534',
  amberBg: '#FFFBEB',
  amberBorder: '#D97706',
  amberText: '#92400E',
  infoBg: '#EFF6FF',
  infoBorder: '#3B82F6',
  infoText: '#1E40AF',
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
      lineHeight: 1.6,
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
        mt: '7px',
      }}
    />
    <span>{parseBold(text)}</span>
  </Box>
);

const SubLabel = ({ children }: { children: React.ReactNode }) => (
  <Typography
    sx={{
      fontSize: 12,
      fontWeight: 700,
      color: C.primary,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      mb: '8px',
    }}
  >
    {children}
  </Typography>
);

const DefRow = ({ term, body }: { term: string; body: string }) => (
  <Box
    sx={{
      py: '8px',
      borderBottom: `1px solid #F3F4F6`,
      display: 'flex',
      gap: '12px',
      '&:last-child': { borderBottom: 'none' },
    }}
  >
    <Typography
      sx={{ fontSize: 13, fontWeight: 600, color: C.neutralText, minWidth: 160, flexShrink: 0 }}
    >
      {term}
    </Typography>
    <Typography sx={{ fontSize: 13, color: C.bodyText, lineHeight: 1.65 }}>
      {parseBold(body)}
    </Typography>
  </Box>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderItem = (item: any, i: number) => {
  switch (item.type) {
    case 'art-block': {
      const nv = item.notice?.variant as string | undefined;
      const ns =
        nv === 'amber'
          ? { bg: C.amberBg, border: C.amberBorder, color: C.amberText }
          : nv === 'green'
            ? { bg: C.greenBg, border: C.greenBorder, color: C.greenText }
            : { bg: C.infoBg, border: C.infoBorder, color: C.infoText };
      return (
        <Box key={i} sx={{ mb: '20px', '&:last-child': { mb: 0 } }}>
          {item.numLabel && (
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 700,
                color: C.muted,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                mb: '4px',
              }}
            >
              {item.numLabel}
            </Typography>
          )}
          {item.artTitle && (
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: C.neutralText, mb: '6px' }}>
              {item.artTitle}
            </Typography>
          )}
          <Typography sx={{ fontSize: 14, color: C.bodyText, lineHeight: 1.75 }}>
            {parseBold(item.text)}
          </Typography>
          {item.notice && (
            <Box
              sx={{
                background: ns.bg,
                borderLeft: `3px solid ${ns.border}`,
                borderRadius: '0 8px 8px 0',
                p: '12px 16px',
                mt: '12px',
              }}
            >
              <Typography sx={{ fontSize: 13, lineHeight: 1.65, color: ns.color }}>
                {parseBold(item.notice.text)}
              </Typography>
            </Box>
          )}
          {item.list && (
            <Box
              component="ul"
              sx={{ p: 0, m: 0, mt: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}
            >
              {(item.list as string[]).map((li: string, j: number) => (
                <CheckItem key={j} text={li} />
              ))}
            </Box>
          )}
        </Box>
      );
    }

    case 'text':
      return (
        <Box key={i} sx={{ mb: '18px', '&:last-child': { mb: 0 } }}>
          <Typography sx={{ fontSize: 14, color: C.bodyText, lineHeight: 1.75 }}>
            {parseBold(item.text)}
          </Typography>
        </Box>
      );

    case 'tagline':
      return (
        <Box
          key={i}
          sx={{
            background: C.softHighlight,
            border: `1px solid rgba(91,85,200,0.2)`,
            borderRadius: '12px',
            px: '20px',
            py: '16px',
            mb: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <FormatQuoteIcon sx={{ color: C.primary, fontSize: 20, flexShrink: 0 }} />
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#3730A3', fontStyle: 'italic' }}>
            {item.text}
          </Typography>
        </Box>
      );

    case 'sub-def':
      return (
        <Box key={i} sx={{ mb: '20px', '&:last-child': { mb: 0 } }}>
          <SubLabel>{item.subLabel}</SubLabel>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {item.rows.map((row: { term: string; body: string }, j: number) => (
              <DefRow key={j} term={row.term} body={row.body} />
            ))}
          </Box>
        </Box>
      );

    case 'check-group':
      return (
        <Box key={i} sx={{ mb: '20px', '&:last-child': { mb: 0 } }}>
          <SubLabel>{item.subLabel}</SubLabel>
          <Typography sx={{ fontSize: 14, color: C.bodyText, lineHeight: 1.75, mb: '12px' }}>
            {parseBold(item.text)}
          </Typography>
          <Box
            component="ul"
            sx={{ p: 0, m: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}
          >
            {(item.list as string[]).map((li: string, j: number) => (
              <CheckItem key={j} text={li} />
            ))}
          </Box>
        </Box>
      );

    case 'notice-box': {
      const variantMap: Record<string, { bg: string; borderColor: string; color: string }> = {
        green: { bg: C.greenBg, borderColor: C.greenBorder, color: C.greenText },
        amber: { bg: C.amberBg, borderColor: C.amberBorder, color: C.amberText },
        info: { bg: C.infoBg, borderColor: C.infoBorder, color: C.infoText },
      };
      const v = variantMap[item.variant as string] ?? variantMap['info'];
      return (
        <Box key={i} sx={{ mb: '20px', '&:last-child': { mb: 0 } }}>
          {item.subLabel && <SubLabel>{item.subLabel}</SubLabel>}
          <Box
            sx={{
              background: v.bg,
              borderLeft: `3px solid ${v.borderColor}`,
              borderRadius: '0 8px 8px 0',
              p: '14px 18px',
            }}
          >
            <Typography sx={{ fontSize: 13, lineHeight: 1.65, color: v.color }}>
              {parseBold(item.text)}
            </Typography>
            {item.highlight && (
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: v.color, mt: '8px' }}>
                {item.highlight}
              </Typography>
            )}
          </Box>
        </Box>
      );
    }

    case 'contact-box':
      return (
        <Box
          key={i}
          sx={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            background: C.neutralBg,
            border: `1px solid ${C.neutralBorder}`,
            borderRadius: '10px',
            p: '14px 18px',
            mt: '14px',
          }}
        >
          <MailOutlineIcon sx={{ color: C.primary, fontSize: 22, flexShrink: 0 }} />
          <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: C.neutralText }}>
              {item.title}
            </Typography>
            <Typography
              component="a"
              href={`mailto:${item.email}`}
              sx={{
                fontSize: 14,
                color: C.primary,
                fontWeight: 500,
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              {item.email}
            </Typography>
          </Box>
        </Box>
      );

    default:
      return null;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AboutContent = ({ sections }: { sections: any[] }) => (
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

export default AboutContent;
