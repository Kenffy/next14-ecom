import React from 'react'
import { Separator } from './ui/separator'

export default function GlobalInformationBar() {
  return (
    <div className="w-full bg-foreground h-8 text-xs text-background/70">
      <div className="h-full w-full container flex items-center justify-between">
        <div className="flex">10€ TemosCo Geschenkgutschein</div>
        <div className="flex items-center gap-2 md:gap-3">
          <span>Prospects</span>
          <Separator orientation="vertical" className='h-2 bg-background/70'/>
          <span>Help</span>
          <Separator orientation="vertical" className='h-2 bg-background/70' />
          <span>Contact</span>
        </div>
      </div>
    </div>
  );
}
