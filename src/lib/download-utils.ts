import html2canvas from 'html2canvas'

export async function downloadAsPng(elementId: string) {
  const element = document.getElementById(elementId)
  if (!element) return

  const canvas = await html2canvas(element, {
    backgroundColor: null,
    scale: 2, // Higher quality
  })

  const dataUrl = canvas.toDataURL('image/png')
  const link = document.createElement('a')
  link.download = `logo-${Date.now()}.png`
  link.href = dataUrl
  link.click()
}
