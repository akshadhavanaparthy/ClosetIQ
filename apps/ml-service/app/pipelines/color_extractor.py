import math

def calculate_ita(L: float, b: float) -> float:
    """
    Individual Typology Angle:
    ITA = arctan((L* - 50) / b*) * (180 / pi)
    """
    if abs(b) < 1e-5:
        return 0.0
    return math.atan((L - 50.0) / b) * (180.0 / math.pi)

def classify_undertone_and_palette(L: float, a: float, b: float):
    """
    Deterministic CIELAB Undertone and Seasonal Color Analysis
    as specified in Section 5.3 of the ClosetIQ Technical Architecture.
    """
    ita = calculate_ita(L, b)

    # 1. Undertone Determination
    if b < 14.0 and (a / max(b, 0.1)) > 0.8:
        undertone = "COOL"
    elif b >= 17.0 and b > a:
        undertone = "WARM"
    elif 45.0 <= L <= 65.0 and a < 10.0 and b < 16.0 and (b - a) > 4.0:
        undertone = "OLIVE"
    else:
        undertone = "NEUTRAL"

    # 2. Seasonal Palette Mapping (12 seasons)
    if undertone == "COOL":
        if L < 45.0:
            palette = "DEEP_WINTER"
        elif L > 65.0:
            palette = "LIGHT_SUMMER"
        elif a > 14.0:
            palette = "BRIGHT_WINTER"
        else:
            palette = "TRUE_WINTER"
    elif undertone == "WARM":
        if L < 45.0:
            palette = "DEEP_AUTUMN"
        elif L > 65.0:
            palette = "LIGHT_SPRING"
        elif b > 22.0:
            palette = "BRIGHT_SPRING"
        else:
            palette = "TRUE_AUTUMN"
    elif undertone == "OLIVE":
        if L < 50.0:
            palette = "DEEP_AUTUMN"
        else:
            palette = "SOFT_AUTUMN"
    else:  # NEUTRAL
        if L > 60.0:
            palette = "SOFT_SUMMER"
        elif L < 45.0:
            palette = "DEEP_WINTER"
        else:
            palette = "TRUE_SUMMER"

    return {
        "itaAngle": round(ita, 1),
        "undertone": undertone,
        "palette": palette,
    }
