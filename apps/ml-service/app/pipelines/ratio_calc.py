import math

def classify_body_shape(shoulder_width: float, waist_width: float, hip_width: float) -> str:
    """
    Deterministic body shape classification logic based on geometric landmark ratios
    as specified in Section 5.2 of the ClosetIQ Technical Architecture.
    """
    if shoulder_width <= 0 or hip_width <= 0:
        return "UNSPECIFIED"

    waist_to_shoulder = waist_width / shoulder_width
    waist_to_hip = waist_width / hip_width

    if waist_to_shoulder <= 0.75 and waist_to_hip <= 0.75:
        if abs(shoulder_width - hip_width) / shoulder_width <= 0.05:
            return "HOURGLASS"
        elif hip_width > shoulder_width * 1.05:
            return "PEAR"
        else:
            return "INVERTED_TRIANGLE"
    elif shoulder_width > hip_width * 1.05:
        return "INVERTED_TRIANGLE"
    elif hip_width > shoulder_width * 1.05:
        return "PEAR"
    elif waist_to_hip >= 0.85 and waist_to_shoulder >= 0.85:
        return "RECTANGLE"
    else:
        return "APPLE"
