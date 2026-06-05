import React from "react";
import { ScrollView, Text, useWindowDimensions, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/lib/ThemeContext";
import {
  getGridItemWidth,
  GRID_GAP,
  useResponsiveColumnCount,
} from "@/lib/responsiveGrid";
import type {
  Block,
  Check as CheckBlock,
  ColorRow as ColorRowBlock,
  Columns as ColumnsBlock,
  Formula as FormulaBlock,
  Heading as HeadingBlock,
  Highlight as HighlightBlock,
  List as ListBlock,
  Lede as LedeBlock,
  Paragraph as ParagraphBlock,
  Phase as PhaseBlock,
  Table as TableBlock,
} from "@/lib/manual";

interface Props {
  block: Block;
  /** Used to render numbered step "lines" for sequential checks */
  isLast?: boolean;
  index?: number;
  /** Accent color override (per-category) */
  accent?: string;
}

const Paragraph: React.FC<{ block: ParagraphBlock }> = ({ block }) => {
  const { colors } = useTheme();
  return (
    <Text
      style={{
        color: colors.textMuted,
        fontFamily: "Jakarta",
        fontSize: 15,
        lineHeight: 23,
      }}
    >
      {block.text}
    </Text>
  );
};

const Lede: React.FC<{ block: LedeBlock }> = ({ block }) => {
  const { colors } = useTheme();
  return (
    <Text
      style={{
        color: colors.text,
        fontFamily: "Jakarta-Medium",
        fontSize: 16,
        lineHeight: 25,
      }}
    >
      {block.text}
    </Text>
  );
};

const Heading: React.FC<{ block: HeadingBlock }> = ({ block }) => {
  const { colors } = useTheme();
  const size = block.level === 2 ? 22 : block.level === 3 ? 19 : 16;
  return (
    <Text
      style={{
        color: colors.text,
        fontFamily: "Jakarta-Bold",
        fontSize: size,
        letterSpacing: -0.3,
        marginTop: 6,
      }}
    >
      {block.text}
    </Text>
  );
};

const ListView: React.FC<{ block: ListBlock; accent?: string }> = ({
  block,
  accent,
}) => {
  const { colors } = useTheme();
  return (
    <View style={{ gap: 9 }}>
      {block.items.map((item, i) => (
        <View
          key={i}
          style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}
        >
          {block.ordered ? (
            <Text
              style={{
                color: accent ?? colors.brand,
                fontFamily: "Jakarta-Bold",
                fontSize: 13,
                width: 22,
                marginTop: 2,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </Text>
          ) : (
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                backgroundColor: accent ?? colors.brand,
                marginTop: 9,
              }}
            />
          )}
          <Text
            style={{
              flex: 1,
              color: colors.textMuted,
              fontFamily: "Jakarta",
              fontSize: 14.5,
              lineHeight: 22,
            }}
          >
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
};

const Highlight: React.FC<{ block: HighlightBlock }> = ({ block }) => {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 12,
        padding: 16,
        borderRadius: 16,
        backgroundColor: colors.brandGlow,
        borderWidth: 1,
        borderColor: colors.borderBrand,
      }}
    >
      <View
        style={{
          width: 28,
          height: 28,
          borderRadius: 999,
          backgroundColor: colors.brand,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="bulb-outline" size={16} color={colors.brandOnBrand} />
      </View>
      <View style={{ flex: 1 }}>
        {block.label && (
          <Text
            style={{
              color: colors.brand,
              fontFamily: "Jakarta-Bold",
              fontSize: 12,
              letterSpacing: 0.5,
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            {block.label}
          </Text>
        )}
        <Text
          style={{
            color: colors.text,
            fontFamily: "Jakarta-Medium",
            fontSize: 14.5,
            lineHeight: 22,
          }}
        >
          {block.text}
        </Text>
      </View>
    </View>
  );
};

const Formula: React.FC<{ block: FormulaBlock }> = ({ block }) => {
  const { colors } = useTheme();
  return (
    <View
      style={{
        padding: 14,
        borderRadius: 12,
        backgroundColor: colors.surfaceMuted,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <Text
        style={{
          fontFamily: "Courier",
          color: colors.brand,
          fontSize: 13,
          letterSpacing: 0.3,
        }}
      >
        {block.text}
      </Text>
    </View>
  );
};

const TableView: React.FC<{ block: TableBlock }> = ({ block }) => {
  const { colors } = useTheme();
  // Use horizontal scroll for narrow screens
  const minColumnWidth = 130;
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingRight: 8 }}
    >
      <View
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 14,
          overflow: "hidden",
          backgroundColor: colors.surface,
        }}
      >
        {/* header */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: colors.surfaceMuted,
          }}
        >
          {block.headers.map((h, i) => (
            <View
              key={i}
              style={{
                width: minColumnWidth + (i === 0 ? 20 : 0),
                padding: 12,
                borderRightWidth: i < block.headers.length - 1 ? 1 : 0,
                borderRightColor: colors.border,
              }}
            >
              <Text
                style={{
                  color: colors.brand,
                  fontFamily: "Jakarta-Bold",
                  fontSize: 11,
                  letterSpacing: 0.6,
                  textTransform: "uppercase",
                }}
              >
                {h}
              </Text>
            </View>
          ))}
        </View>
        {block.rows.map((row, r) => (
          <View
            key={r}
            style={{
              flexDirection: "row",
              borderTopWidth: 1,
              borderTopColor: colors.border,
            }}
          >
            {row.map((cell, c) => (
              <View
                key={c}
                style={{
                  width: minColumnWidth + (c === 0 ? 20 : 0),
                  padding: 12,
                  borderRightWidth: c < row.length - 1 ? 1 : 0,
                  borderRightColor: colors.border,
                }}
              >
                <Text
                  style={{
                    color: c === 0 ? colors.text : colors.textMuted,
                    fontFamily: c === 0 ? "Jakarta-SemiBold" : "Jakarta",
                    fontSize: 13,
                    lineHeight: 20,
                  }}
                >
                  {cell}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const Phase: React.FC<{ block: PhaseBlock; isLast?: boolean }> = ({
  block,
  isLast,
}) => {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: "row", gap: 14 }}>
      <View style={{ alignItems: "center" }}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 999,
            backgroundColor: colors.brandGlow,
            borderWidth: 1.5,
            borderColor: colors.borderBrand,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: colors.brand,
              fontFamily: "Jakarta-Bold",
              fontSize: 14,
            }}
          >
            {block.number}
          </Text>
        </View>
        {!isLast && (
          <View
            style={{
              width: 2,
              flex: 1,
              backgroundColor: colors.border,
              marginTop: 4,
              minHeight: 24,
            }}
          />
        )}
      </View>
      <View style={{ flex: 1, paddingBottom: 22 }}>
        <Text
          style={{
            color: colors.text,
            fontFamily: "Jakarta-Bold",
            fontSize: 17,
            letterSpacing: -0.2,
            marginBottom: 6,
          }}
        >
          {block.title}
        </Text>
        {block.body.map((b, i) => (
          <View key={i} style={{ marginTop: i === 0 ? 0 : 8 }}>
            {b.paragraph && (
              <Text
                style={{
                  color: colors.textMuted,
                  fontFamily: "Jakarta",
                  fontSize: 14.5,
                  lineHeight: 22,
                }}
              >
                {b.paragraph}
              </Text>
            )}
            {b.outcome && (
              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                  marginTop: 6,
                  padding: 10,
                  borderRadius: 10,
                  backgroundColor: colors.surfaceMuted,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={colors.success}
                  style={{ marginTop: 1 }}
                />
                <Text
                  style={{
                    flex: 1,
                    color: colors.textMuted,
                    fontFamily: "Jakarta",
                    fontSize: 13.5,
                    lineHeight: 20,
                  }}
                >
                  <Text
                    style={{
                      color: colors.text,
                      fontFamily: "Jakarta-Bold",
                    }}
                  >
                    Utfall:{" "}
                  </Text>
                  {b.outcome}
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const Check: React.FC<{ block: CheckBlock; isLast?: boolean }> = ({
  block,
  isLast,
}) => {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: "row", gap: 14 }}>
      <View style={{ alignItems: "center" }}>
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 999,
            backgroundColor: colors.brand,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: colors.brandOnBrand,
              fontFamily: "Jakarta-Bold",
              fontSize: 12,
            }}
          >
            {block.label}
          </Text>
        </View>
        {!isLast && (
          <View
            style={{
              width: 2,
              flex: 1,
              backgroundColor: colors.border,
              marginTop: 4,
              minHeight: 14,
            }}
          />
        )}
      </View>
      <View style={{ flex: 1, paddingBottom: 16 }}>
        {block.title && (
          <Text
            style={{
              color: colors.text,
              fontFamily: "Jakarta-Bold",
              fontSize: 15,
              marginBottom: 4,
              letterSpacing: -0.2,
            }}
          >
            {block.title}
          </Text>
        )}
        <Text
          style={{
            color: colors.textMuted,
            fontFamily: "Jakarta",
            fontSize: 14.5,
            lineHeight: 22,
          }}
        >
          {block.body}
        </Text>
      </View>
    </View>
  );
};

const ColumnCard: React.FC<{
  col: ColumnsBlock["columns"][number];
  accent?: string;
  width: number;
}> = ({ col, accent, width }) => {
  const { colors } = useTheme();
  return (
    <View
      style={{
        width,
        backgroundColor: colors.surfaceRaised,
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
          {col.title && (
            <Text
              style={{
                color: colors.text,
                fontFamily: "Jakarta-Bold",
                fontSize: 15,
                marginBottom: 10,
                letterSpacing: -0.2,
              }}
            >
              {col.title}
            </Text>
          )}
          {col.paragraph && (
            <Text
              style={{
                color: colors.textMuted,
                fontFamily: "Jakarta",
                fontSize: 14,
                lineHeight: 22,
                marginBottom: col.items ? 10 : 0,
              }}
            >
              {col.paragraph}
            </Text>
          )}
          {col.items && (
            <View style={{ gap: 8 }}>
              {col.items.map((item, j) => (
                <View
                  key={j}
                  style={{
                    flexDirection: "row",
                    gap: 9,
                    alignItems: "flex-start",
                  }}
                >
                  <View
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: 999,
                      backgroundColor: accent ?? colors.brand,
                      marginTop: 9,
                    }}
                  />
                  <Text
                    style={{
                      flex: 1,
                      color: colors.textMuted,
                      fontFamily: "Jakarta",
                      fontSize: 14,
                      lineHeight: 21,
                    }}
                  >
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          )}
    </View>
  );
};

const ColumnsView: React.FC<{ block: ColumnsBlock; accent?: string }> = ({
  block,
  accent,
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const responsiveColumns = useResponsiveColumnCount(block.count);
  const columnCount = Math.min(block.columns.length, responsiveColumns);
  const itemWidth = getGridItemWidth(screenWidth, columnCount, {
    gap: GRID_GAP,
    horizontalPadding: 20,
  });

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: GRID_GAP }}>
      {block.columns.map((col, i) => (
        <ColumnCard key={i} col={col} accent={accent} width={itemWidth} />
      ))}
    </View>
  );
};

const ColorRow: React.FC<{ block: ColorRowBlock }> = ({ block }) => {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 12,
        borderRadius: 12,
        backgroundColor: colors.surfaceRaised,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <View
        style={{
          width: 28,
          height: 28,
          borderRadius: 999,
          backgroundColor: block.swatch ?? "transparent",
          borderWidth: block.swatch ? 1 : 1.5,
          borderColor: block.swatch
            ? "rgba(255,255,255,0.25)"
            : colors.borderStrong,
          borderStyle: block.swatch ? "solid" : "dashed",
        }}
      />
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: colors.text,
            fontFamily: "Jakarta-SemiBold",
            fontSize: 14,
          }}
        >
          {block.system}
        </Text>
        <Text
          style={{
            color: colors.textSubtle,
            fontFamily: "Jakarta",
            fontSize: 12,
            marginTop: 1,
          }}
        >
          {block.color} · {block.comment}
        </Text>
      </View>
    </View>
  );
};

export const ContentBlock: React.FC<Props> = ({
  block,
  isLast,
  accent,
}) => {
  switch (block.type) {
    case "paragraph":
      return <Paragraph block={block} />;
    case "lede":
      return <Lede block={block} />;
    case "heading":
      return <Heading block={block} />;
    case "list":
      return <ListView block={block} accent={accent} />;
    case "highlight":
      return <Highlight block={block} />;
    case "formula":
      return <Formula block={block} />;
    case "table":
      return <TableView block={block} />;
    case "phase":
      return <Phase block={block} isLast={isLast} />;
    case "check":
      return <Check block={block} isLast={isLast} />;
    case "columns":
      return <ColumnsView block={block} accent={accent} />;
    case "colorRow":
      return <ColorRow block={block} />;
    default:
      return null;
  }
};

export default ContentBlock;
