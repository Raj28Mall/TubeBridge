import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"

interface PricingCardProps {
  title: string
  price: string
  period?: string
  description: string
  features: string[]
  buttonText: string
  buttonVariant: "default" | "outline"
  popular?: boolean
}

export function PricingCard({
  title,
  price,
  period,
  description,
  features,
  buttonText,
  buttonVariant,
  popular = false,
}: PricingCardProps) {
  return (
    <div
      className={`relative flex flex-col rounded-lg border ${popular ? "border-primary shadow-lg" : "shadow-sm"} bg-card p-6`}
    >
      {popular && (
        <div className="absolute -top-4 right-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
          Popular
        </div>
      )}

      <div className="mb-5">
        <h3 className="text-2xl font-bold">{title}</h3>
        <div className="mt-2 flex items-baseline">
          <span className="text-4xl font-extrabold">{price}</span>
          {period && <span className="ml-1 text-muted-foreground">{period}</span>}
        </div>
        <p className="mt-3 text-muted-foreground">{description}</p>
      </div>

      <ul className="mb-6 space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <Check className="mr-2 h-5 w-5 text-green-500" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        <Button asChild variant={buttonVariant} className="w-full">
          <Link href="/auth">{buttonText}</Link>
        </Button>
      </div>
    </div>
  )
}

