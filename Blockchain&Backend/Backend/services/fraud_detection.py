import numpy as np

class FraudDetectionService:
    """Stub example. Replace with ML logic/Scikit-learn if needed."""
    def is_suspicious(self, donation_amount: float, previous_donations: list) -> bool:
        # Example: flag if amount is >5x the last N average
        if not previous_donations:
            return False
        mean = np.mean(previous_donations)
        return donation_amount > mean * 5

    def explain(self, donation_amount: float, previous_donations: list) -> str:
        if self.is_suspicious(donation_amount, previous_donations):
            return "Donation flagged: unusually large compared to user history."
        return "No anomaly detected."
