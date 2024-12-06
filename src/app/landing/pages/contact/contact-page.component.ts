import { Component } from '@angular/core';

import {
  LucideAngularModule,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
} from 'lucide-angular';

import ContactFormComponent from '@/landing/components/contact-form/contact-form.component';

@Component({
  selector: 'landing-contact-page',
  imports: [LucideAngularModule, ContactFormComponent],
  templateUrl: './contact-page.component.html',
})
export default class ContactPageComponent {
  readonly MailIcon = MailIcon;
  readonly PhoneIcon = PhoneIcon;
  readonly MapPinIcon = MapPinIcon;
  readonly TwitterIcon = TwitterIcon;
  readonly FacebookIcon = FacebookIcon;
  readonly InstagramIcon = InstagramIcon;
}
